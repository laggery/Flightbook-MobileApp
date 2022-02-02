import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { v4 as uuidv4 } from 'uuid';
import { Flight } from 'src/app/core/domain/flight';
import { Glider } from 'src/app/core/domain/glider';
import { FlightService } from 'src/app/core/services/flight.service';
import { GliderService } from 'src/app/core/services/glider.service';
import { FileUploadService } from 'src/app/core/services/fileupload.service';
import { IgcService } from 'src/app/core/services/igc.service';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.page.html',
  styleUrls: ['./flight-edit.page.scss'],
})
export class FlightEditPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private readonly flightId: number;
  private readonly initialFlight: Flight;
  private decoder = new TextDecoder('utf-8');
  flight: Flight;
  gliders: Glider[] = [];
  igcFile: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private gliderService: GliderService,
    private alertController: AlertController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private fileUploadService: FileUploadService,
    private igcService: IgcService
  ) {
    this.flightId = +this.activeRoute.snapshot.paramMap.get('id');
    this.initialFlight = this.flightService.getValue().find(flight => flight.id === this.flightId);
    this.flight = _.cloneDeep(this.initialFlight);
    if (!this.flight) {
      this.getFlightFromDashboardNavigation();
    }

    if (this.gliderService.isGliderlistComplete) {
      this.gliders = this.gliderService.getValue();
    } else {
      this.gliderService.getGliders().pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
        this.gliderService.isGliderlistComplete = true;
        this.gliders = this.gliderService.getValue();
      });
    }
    this.loadIgcData();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async saveFlight(flight: Flight) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.saveflight')
    });
    await loading.present();

    if (flight.igcFile) {
      await this.uploadIgc(flight, loading);
    }

    this.flightService.putFlight(flight).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight) => {

      if (this.initialFlight?.date !== this.flight.date) {
        this.flightService.getFlights({ limit: this.flightService.defaultLimit, clearStore: true })
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(async (res: Flight[]) => {
            await loading.dismiss();
            await this.router.navigate(['/flights'], { replaceUrl: true });
          });
      } else {
        await loading.dismiss();
        await this.router.navigate(['/flights'], { replaceUrl: true });
      }
    },
      (async (resp: any) => {
        await loading.dismiss();
        if (resp.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
          const alert = await this.alertController.create({
            header: this.translate.instant('message.infotitle'),
            message: resp.error.message,
            buttons: [this.translate.instant('buttons.done')]
          });
          await alert.present();
        }
      })
    );
  }

  async delete() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.deleteflight')
    });
    await loading.present();

    this.flightService.deleteFlight(this.flight).subscribe(async (res: any) => {
      await loading.dismiss();
      this.router.navigate(['/flights'], { replaceUrl: true });
    },
      (async (resp: any) => {
        await loading.dismiss();
      })
    );
  }

  async copy() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.copyflight')
    });

    if (this.flight.igc) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('flight.copyIgc'),
        buttons: [
          {
            text: this.translate.instant('buttons.yes'),
            handler: async () => {
              await this.copyIgc(loading);
              await this.postFlightRequest(loading);
            }
          },
          {
            text: this.translate.instant('buttons.no'),
            handler: () => {
              this.flight.igc = null;
              loading.present();
              this.postFlightRequest(loading);
            }
          }
        ]
      });
      await alert.present();
      await alert.onDidDismiss();
    } else {
      loading.present();
      this.postFlightRequest(loading);
    }
  }

  private postFlightRequest(loading: any) {
    this.flightService.postFlight(this.flight, { clearStore: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight) => {
      this.flightService.getFlights({ limit: this.flightService.defaultLimit, clearStore: true })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(async (res: Flight[]) => {
          await loading.dismiss();
          await this.router.navigate(['/flights'], { replaceUrl: true });
        });
    },
      (async (resp: any) => {
        await loading.dismiss();
        if (resp.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
          const alert = await this.alertController.create({
            header: this.translate.instant('message.infotitle'),
            message: resp.error.message,
            buttons: [this.translate.instant('buttons.done')]
          });
          await alert.present();
        }
      })
    );
  }

  // @hack -> copyObject is not working on digitalocean
  private async copyIgc(loading: any) {
    await loading.present();
    const destinationFileName = `${uuidv4()}-${this.flight.igc.filepath.substring(37)}`;
    const file: File = new File([this.igcFile], destinationFileName);
    const formData = new FormData();
    formData.append('file', file, destinationFileName);
    try {
      const res = await this.fileUploadService.uploadFile(formData).toPromise();
      this.flight.igc.filepath = destinationFileName;
      return true;
    } catch (error) {
      this.flight.igc = null;
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('message.igcCopyError'),
        buttons: [this.translate.instant('buttons.done')]
      });
      loading.dismiss();
      await alert.present();
      await alert.onDidDismiss();
      await loading.present();
      return false;
    }
  }

  async onFilesSelectEvent($event: File[]) {
    this.flight.igcFile = $event[0];
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.igcRead')
    });

    const override = await this.doOverride();

    await loading.present();

    this.igcFile = await this.igcService.getIgcFileContentAndPrefillFlight(this.flight, this.flight.igcFile, override);

    await loading.dismiss();
  }

  private async doOverride(): Promise<boolean> {
    let doOverride = false;
    const alert = await this.alertController.create({
      header: this.translate.instant('message.infotitle'),
      message: this.translate.instant('flight.override'),
      buttons: [
        {
          text: this.translate.instant('buttons.yes'),
          handler: () => {
            doOverride = true;
          }
        },
        this.translate.instant('buttons.no')

      ]
    });

    await alert.present();
    await alert.onDidDismiss();
    await alert.dismiss();
    return doOverride;
  }

  private getFlightFromDashboardNavigation() {
    const lastFlight = this.router.getCurrentNavigation().extras.state.flight;
    if (!!lastFlight) {
      lastFlight.date = new Date().toISOString().slice(0, 10);
      this.flight = lastFlight;
    } else {
      this.router.navigate(['/flights'], { replaceUrl: true });
    }
  }

  private async loadIgcData() {
    if (this.flight.igc && this.flight.igc.filepath) {
      this.fileUploadService.getFile(this.flight.igc.filepath).pipe(takeUntil(this.unsubscribe$)).subscribe(async blob => {
        const blobText = await blob.text();
        this.igcFile = this.decoder.decode(new Uint8Array(JSON.parse(blobText).data));
      })
    }
  }

  private async uploadIgc(flight: Flight, loading: any) {
    const formData = new FormData();
    formData.append('file', flight.igcFile, flight.igcFile.name);
    try {
      const res = await this.fileUploadService.uploadFile(formData).toPromise();
      flight.igc.filepath = flight.igcFile.name;
      return true;
    } catch (error) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('message.igcUploadError'),
        buttons: [this.translate.instant('buttons.done')]
      });
      loading.dismiss();
      await alert.present();
      await alert.onDidDismiss();
      await loading.present();
      return false;
    }
  }
}
