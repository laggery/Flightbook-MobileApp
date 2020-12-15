import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalController, LoadingController } from '@ionic/angular';
import { FlightFilterComponent } from '../../form/flight-filter/flight-filter.component';
import { TranslateService } from '@ngx-translate/core';
import { FlightService, FlightStatistic } from 'flightbook-commons-library';
import { BarChartComponent } from 'src/app/charts/bar-chart/bar-chart.component';

@Component({
  selector: 'app-flight-statistic',
  templateUrl: './flight-statistic.page.html',
  styleUrls: ['./flight-statistic.page.scss'],
})
export class FlightStatisticPage implements OnInit, OnDestroy {
  @ViewChild(BarChartComponent) barChart: BarChartComponent;
  unsubscribe$ = new Subject<void>();
  statistics: FlightStatistic;
  statisticsList: FlightStatistic[];
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
    this.statisticsList = [];
  }

  private async initialDataLoad() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.flightService.getStatistics(true).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: FlightStatistic[]) => {
      await loading.dismiss();
      this.statistics = res.find((stat:FlightStatistic) => (!stat.year));
      this.statisticsList = res.filter((stat:FlightStatistic) => (stat.year));
      this.barChart.displayBarChart(this.statisticsList);
    }, async (error: any) => {
      await loading.dismiss();
    });
  }

  ngOnInit() {
    this.initialDataLoad();
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
      this.statisticsList.splice(0, this.statisticsList.length);
      this.statisticsList = resp.data.statistic.filter((stat:FlightStatistic) => (stat.year));
      this.barChart.displayBarChart(this.statisticsList);
    })
  }
}
