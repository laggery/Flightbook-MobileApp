import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Flight, FlightService, Place, Glider, GliderService, FileUploadService } from 'flightbook-commons-library';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import * as IGCParser from 'igc-parser';
import { scoringRules as scoring, solver } from 'igc-xc-score';

@Component({
  selector: 'app-flight-add',
  templateUrl: './flight-add.page.html',
  styleUrls: ['./flight-add.page.scss'],
})
export class FlightAddPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  flight: Flight;
  gliders: Glider[] = [];
  igcFile: string;

  constructor(
    private router: Router,
    private flightService: FlightService,
    private gliderService: GliderService,
    private alertController: AlertController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private fileUploadService: FileUploadService
  ) {
    this.flight = new Flight();
    this.flight.date = new Date().toISOString();
    this.flight.glider = new Glider();
    this.flight.start = new Place();
    this.flight.landing = new Place();
  }

  ngOnInit() {
    if (this.flightService.getValue().length > 0) {
      this.flight.glider = this.flightService.getValue()[0].glider;
    } else {
      this.flightService.getFlights({ limit: 1, store: false })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: Flight[]) => {
          if (res.length > 0) {
            this.flight.glider = res[0].glider;
          }
        });
    }

    if (this.gliderService.isGliderlistComplete) {
      this.noGliderCheck();
      this.gliders = this.gliderService.getValue();
    } else {
      this.gliderService.getGliders({ clearStore: true }).pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
        this.noGliderCheck();
        this.gliderService.isGliderlistComplete = true;
        this.gliders = this.gliderService.getValue();
      });
    }
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

    this.flightService.postFlight(flight).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight) => {
      await loading.dismiss();
      await this.router.navigate(['/flights'], { replaceUrl: true });
    },
      async (resp: any) => {
        await loading.dismiss();
        if (resp.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
          const alert = await this.alertController.create({
            header: this.translate.instant('message.infotitle'),
            message: resp.error.message,
            buttons: [this.translate.instant('buttons.done')]
          });
          await alert.present();
        }
      }
    );
  }

  private async uploadIgc(flight: Flight, loading: any) {
    const formData = new FormData();
    formData.append('file', flight.igcFile, flight.igcFile.name);
    try {
      const res = await this.fileUploadService.uploadFile(formData).toPromise();
      flight.igcFilepath = flight.igcFile.name;
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

  onFileSelectEvent($event: File) {
    this.flight.igcFile = $event;
  }

  async prefillWithIGCData($event: string | ArrayBuffer) {
    if (typeof $event === 'string') {
      const loading = await this.loadingCtrl.create({
        message: this.translate.instant('loading.igcRead')
      });

      await loading.present();

      this.igcFile = $event;
      const igcFile: any = IGCParser.parse($event, { lenient: true });
      const result = solver(igcFile, scoring.XCScoring, {}).next().value;
      await loading.dismiss();
      if (result.optimal) {
        this.flight.km = result.scoreInfo.distance;
      }
      this.flight.date = igcFile.date;
      const timeInMillisecond = (igcFile.ll[0].landing - igcFile.ll[0].launch) * 1000
      this.flight.time = new Date(timeInMillisecond).toISOString().substr(11, 8);
    }
  }

  private async noGliderCheck() {
    if (this.gliderService.getValue().length === 0) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.noglidertitle'),
        message: this.translate.instant('message.noglider'),
        buttons: [this.translate.instant('buttons.done')]
      });

      await alert.present();
      await this.router.navigate(['/gliders/add'], { replaceUrl: true });
    }
  }
}
