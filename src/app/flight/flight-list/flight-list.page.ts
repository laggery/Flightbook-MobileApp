import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Flight } from '../flight';
import { NavController, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { FlightService } from '../flight.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlightFilterComponent } from 'src/app/form/flight-filter/flight-filter.component';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.page.html',
  styleUrls: ['./flight-list.page.scss'],
})
export class FlightListPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  unsubscribe$ = new Subject<void>();
  flights$: Observable<Flight[]>;
  filtered: boolean;

  constructor(
    public navCtrl: NavController,
    private flightService: FlightService,
    private modalCtrl: ModalController
  ) {
    this.flights$ = this.flightService.getState();
    this.filtered = this.flightService.filtered$.getValue();
    this.flightService.filtered$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: boolean) => {
      this.filtered = value;
    })

    if (this.flightService.getValue().length === 0) {
      this.flightService.getFlights({ limit: this.flightService.defaultLimit }).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Flight[]) => {
        // TODO hide loading page
      });
    }
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
    return await modal.present();
  }
}
