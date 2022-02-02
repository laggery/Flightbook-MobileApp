import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IonInfiniteScroll, ModalController, LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Glider } from 'src/app/core/domain/glider';
import { FlightFilter } from 'src/app/core/domain/flight-filter';
import { FlightService } from 'src/app/core/services/flight.service';
import { GliderService } from 'src/app/core/services/glider.service';
import { FlightStatistic } from 'src/app/core/domain/flightStatistic';
import { Flight } from 'src/app/core/domain/flight';

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
    if (type === 'from') {
      this.filter.from = null;
    } else {
      this.filter.to = null;
    }
  }

  private async closeFilter() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();

    if (this.type === 'FlightListPage') {
      this.closeFlightFilter(loading);
    } else {
      this.closeStatisticFilter(loading);
    }
  }

  private async closeFlightFilter(loading: HTMLIonLoadingElement) {
    this.infiniteScroll.disabled = false;
    this.flightService.getFlights({ limit: this.flightService.defaultLimit, clearStore: true })
      .pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
      await loading.dismiss();
      this.modalCtrl.dismiss({
        dismissed: true
      });
    }, async (error: any) => {
      await loading.dismiss();
    });
  }

  private async closeStatisticFilter(loading: HTMLIonLoadingElement) {
    this.flightService.setState([]);
    this.flightService.getStatistics(true).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: FlightStatistic) => {
      await loading.dismiss();
      this.modalCtrl.dismiss({
        dismissed: true,
        statistic: res
      });
    }, async (error: any) => {
      await loading.dismiss();
    });
  }
}
