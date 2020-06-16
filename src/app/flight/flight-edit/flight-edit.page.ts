import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Flight } from '../flight';
import { Glider } from 'src/app/glider/glider';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../flight.service';
import { GliderService } from 'src/app/glider/glider.service';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.page.html',
  styleUrls: ['./flight-edit.page.scss'],
})
export class FlightEditPage implements OnInit {
  unsubscribe$ = new Subject<void>();
  private flightId: number;
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
    this.flight = this.flightService.getValue().find(flight => flight.id === this.flightId);
    this.flight = _.cloneDeep(this.flight);
    if (!this.flight) {
      this.router.navigate(['/flights'], { replaceUrl: true });
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
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.saveflight')
    });
    await loading.present();

    this.flightService.putFlight(flight).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight) => {
      await loading.dismiss();
      this.router.navigate(['/flights'], { replaceUrl: true });
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
    let loading = await this.loadingCtrl.create({
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
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.copyflight')
    });
    await loading.present();

    this.flightService.postFlight(this.flight, {clearStore: false}).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight) => {
      await loading.dismiss();
      this.router.navigate(['/flights'], { replaceUrl: true });
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
}
