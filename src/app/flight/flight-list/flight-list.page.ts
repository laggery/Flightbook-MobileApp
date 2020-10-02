import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController, ModalController, IonInfiniteScroll, IonContent, LoadingController } from '@ionic/angular';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlightFilterComponent } from 'src/app/form/flight-filter/flight-filter.component';
import { TranslateService } from '@ngx-translate/core';
import { Flight, FlightService } from 'flightbook-commons-library';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.page.html',
  styleUrls: ['./flight-list.page.scss'],
})
export class FlightListPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  unsubscribe$ = new Subject<void>();
  flights$: Observable<Flight[]>;
  filtered: boolean;

  constructor(
    public navCtrl: NavController,
    private flightService: FlightService,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController
  ) {
    this.flights$ = this.flightService.getState();
    this.filtered = this.flightService.filtered$.getValue();
    this.flightService.filtered$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: boolean) => {
      this.filtered = value;
    })

    if (this.flightService.getValue().length === 0) {
      this.initialDataLoad();
    }
  }

  private async initialDataLoad() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.flightService.getFlights({ limit: this.flightService.defaultLimit }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
      await loading.dismiss();
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

  loadData(event: any) {
    this.flightService.getFlights({ limit: this.flightService.defaultLimit, offset: this.flightService.getValue().length })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: Flight[]) => {
        event.target.complete();
        if (res.length < this.flightService.defaultLimit) {
          event.target.disabled = true;
        }
      });
  }

  itemTapped(event: MouseEvent, flight: Flight) {
    this.navCtrl.navigateForward(`flights/${flight.id}`);
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FlightFilterComponent,
      cssClass: 'flight-filter-class',
      componentProps: {
        'infiniteScroll': this.infiniteScroll,
        'type': "FlightListPage"
      }
    });

    this.modalOnDidDismiss(modal);

    return await modal.present();
  }

  async modalOnDidDismiss(modal: HTMLIonModalElement) {
    modal.onDidDismiss().then((resp: any) => {
      this.content.scrollToTop();
    })
  }
}
