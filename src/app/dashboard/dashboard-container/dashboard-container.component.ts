import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { FlightStatistic } from 'src/app/flight/shared/flightStatistic.model';
import { Flight } from 'src/app/flight/shared/flight.model';
import { FlightService } from 'src/app/flight/shared/flight.service';

@Component({
  selector: 'fb-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
})
export class DashboardContainerComponent implements OnInit {

  flightStatistics$: Observable<FlightStatistic | FlightStatistic[]>;
  flights$: Observable<Flight[]>;

  constructor(private flightService: FlightService,
              public navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.flights$ = this.flightService.getState();
    this.flightStatistics$ = this.flightService.getStatistics(true).pipe(
      map(flightStatistic => flightStatistic));
  }

  async openLastFlight() {
    this.flights$
      .pipe(take(1))
      .subscribe((flightArray: Flight[]) => {
        if (flightArray.length > 0) {
          this.navCtrl.navigateForward(`flights/${flightArray[0].id}`);
        }
      });
  }

  async openAddFlight() {
    this.navCtrl.navigateRoot('flights/add');
  }

  async openStatistics() {
    this.navCtrl.navigateForward('flights/statistic');
  }
}
