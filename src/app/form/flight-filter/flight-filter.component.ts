import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IonInfiniteScroll, ModalController, LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { FlightService } from '../../flight/flight.service';
import { TranslateService } from '@ngx-translate/core';
import { FlightFilter } from '../../flight/flight-filter';
import { Glider } from 'src/app/glider/glider';
import { GliderService } from 'src/app/glider/glider.service';
import { takeUntil } from 'rxjs/operators';
import { Flight } from '../../flight/flight';
import { FlightStatistic } from '../../flight/flightStatistic';

@Component({
  selector: 'app-flight-filter',
  templateUrl: './flight-filter.component.html',
  styleUrls: ['./flight-filter.component.scss'],
})
export class FlightFilterComponent implements OnInit, OnDestroy {
  @Input() infiniteScroll: IonInfiniteScroll;
  @Input() type: string;
  public gliders: Glider[];
  private unsubscribe$ = new Subject<void>();
  public filter: FlightFilter;

  constructor(
    private modalCtrl: ModalController,
    private flightService: FlightService,
    private gliderService: GliderService,
    private loadingCtrl: LoadingController,
    private translate: TranslateService
  ) {
    this.filter = this.flightService.filter;

    if (this.gliderService.isGliderlistComplete) {
      this.gliders = this.gliderService.getValue();
    } else {
      this.gliderService.getGliders({ clearStore: true }).pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
        this.gliderService.isGliderlistComplete = true;
        this.gliders = this.gliderService.getValue();
      });
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async filterElement() {
    this.flightService.filter = this.filter;
    this.closeFilter();
  }

  clearFilter() {
    this.filter = new FlightFilter();
    this.flightService.filter = this.filter;
    this.closeFilter();
  }

  clearGLiderButton() {
    this.filter.glider = new Glider();
  }

  clearDateButton(type: string) {
    if (type === "from") {
      this.filter.from = null;
    } else {
      this.filter.to = null;
    }
  }

  private async closeFilter() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();

    if (this.type === "FlightListPage") {
      this.closeFlightFilter(loading);
    } else {
      this.closeStatisticFilter(loading);
    }
  }

  private async closeFlightFilter(loading: HTMLIonLoadingElement) {
    this.infiniteScroll.disabled = false;
    this.flightService.getFlights({ limit: this.flightService.defaultLimit, clearStore: true }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
      await loading.dismiss();
      this.modalCtrl.dismiss({
        'dismissed': true
      });
    }, async (error: any) => {
      await loading.dismiss();
    });
  }

  private async closeStatisticFilter(loading: HTMLIonLoadingElement) {
    this.flightService.setState([]);
    this.flightService.getStatistics().pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: FlightStatistic) => {
      await loading.dismiss();
      this.modalCtrl.dismiss({
        'dismissed': true,
        'statistic': res
      });
    }, async (error: any) => {
      await loading.dismiss();
    });
  }
}
