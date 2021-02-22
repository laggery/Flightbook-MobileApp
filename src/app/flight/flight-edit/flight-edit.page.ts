import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Flight, FlightService, Glider, GliderService } from 'flightbook-commons-library';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.page.html',
  styleUrls: ['./flight-edit.page.scss'],
})
export class FlightEditPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private readonly flightId: number;
  private readonly initialFlight: Flight;
  flight: Flight;
  gliders: Glider[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private gliderService: GliderService,
    private alertController: AlertController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController
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

    this.flightService.putFlight(flight).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight) => {

      // TODO move this to add flight
      if (this.initialFlight?.date !== this.flight.date) {
        this.flightService.getFlights({ limit: this.flightService.defaultLimit, clearStore: true })
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(async (res: Flight[]) => {
          await loading.dismiss();
          this.router.navigate(['/flights'], { replaceUrl: true });
        });
      } else {
        await loading.dismiss();
        this.router.navigate(['/flights'], { replaceUrl: true });
      }
    },
      (async (resp: any) => {
        await loading.dismiss();
        if (resp.status === 422) {
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
    await loading.present();

    this.flightService.postFlight(this.flight, {clearStore: false}).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight) => {
      this.flightService.getFlights({ limit: this.flightService.defaultLimit, clearStore: true })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(async (res: Flight[]) => {
        await loading.dismiss();
        this.router.navigate(['/flights'], { replaceUrl: true });
      });
    },
      (async (resp: any) => {
        await loading.dismiss();
        if (resp.status === 422) {
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

  private getFlightFromDashboardNavigation() {
    const lastFlight = this.router.getCurrentNavigation().extras.state.flight;
    if (!!lastFlight) {
      lastFlight.date = new Date().toISOString().slice(0, 10);
      this.flight = lastFlight;
    } else {
      this.router.navigate(['/flights'], { replaceUrl: true });
    }
  }
}
