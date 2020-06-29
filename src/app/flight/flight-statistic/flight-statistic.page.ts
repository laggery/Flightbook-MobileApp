import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlightService } from '../flight.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FlightStatistic } from '../flightStatistic';
import { ModalController, LoadingController } from '@ionic/angular';
import { FlightFilterComponent } from '../../form/flight-filter/flight-filter.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-flight-statistic',
  templateUrl: './flight-statistic.page.html',
  styleUrls: ['./flight-statistic.page.scss'],
})
export class FlightStatisticPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  statistics: FlightStatistic;
  filtered: boolean;

  constructor(
    private flightService: FlightService,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController
  ) {
    this.filtered = this.flightService.filtered$.getValue();
    this.flightService.filtered$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: boolean) => {
      this.filtered = value;
    })

    this.statistics = new FlightStatistic();
    this.initialDataLoad();
  }

  private async initialDataLoad() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.flightService.getStatistics().pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: FlightStatistic) => {
      await loading.dismiss();
      this.statistics = res;
    }, async (error: any) => {
      await loading.dismiss();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FlightFilterComponent,
      cssClass: 'flight-filter-class',
      componentProps: {
        'type': "FlightStatisticPage"
      }
    });

    this.modalOnDidDismiss(modal);
    
    return await modal.present();
  }

  async modalOnDidDismiss(modal: HTMLIonModalElement) {
    modal.onDidDismiss().then((resp: any) => {
      this.statistics = resp.data.statistic;
    })
  }
}
