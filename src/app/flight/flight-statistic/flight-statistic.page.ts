import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlightService } from '../flight.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FlightStatistic } from '../flightStatistic';
import { ModalController } from '@ionic/angular';
import { FlightFilterComponent } from '../../form/flight-filter/flight-filter.component';

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
    private modalCtrl: ModalController
  ) {
    this.filtered = this.flightService.filtered$.getValue();
    this.flightService.filtered$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: boolean) => {
      this.filtered = value;
    })

    this.statistics = new FlightStatistic();
    this.flightService.getStatistics().pipe(takeUntil(this.unsubscribe$)).subscribe((res: FlightStatistic) => {
      // TODO hide loading page
      this.statistics = res;
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
