import { Component, OnInit, OnDestroy } from '@angular/core';
import { Flight } from '../flight';
import { NavController } from '@ionic/angular';
import { FlightService } from '../flight.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.page.html',
  styleUrls: ['./flight-list.page.scss'],
})
export class FlightListPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  flights$: Observable<Flight[]>;
  limit = 20;

  constructor(
    public navCtrl: NavController,
    private flightService: FlightService
  ) {
    this.flights$ = this.flightService.getState();

    if (this.flightService.getValue().length === 0) {
      this.flightService.getFlights({ limit: this.limit }).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Flight[]) => {
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
    this.flightService.getFlights({ limit: this.limit, offset: this.flightService.getValue().length })
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: Flight[]) => {
      event.target.complete();
      if (res.length < this.limit) {
        event.target.disabled = true;
      }
    });
  }

  itemTapped(event: MouseEvent, flight: Flight) {
    this.navCtrl.navigateForward(`flights/${flight.id}`);
  }
}
