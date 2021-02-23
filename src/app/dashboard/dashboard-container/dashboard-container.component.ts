import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight, FlightService } from 'flightbook-commons-library';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'fb-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
})
export class DashboardContainerComponent implements OnInit {

  flights$: Observable<Flight[]>;

  constructor(private flightService: FlightService,
              private router: Router
  ) {
  }

  ngOnInit() {
    this.flights$ = this.flightService.getState();
  }

  async handleCopyLastFlight() {
    this.flights$
      .pipe(take(1))
      .subscribe((flightArray: Flight[]) => {
        if (flightArray.length > 0) {
          this.router.navigate(['flights/add'], { state: { flight: flightArray[0] } });
        }
      });
  }
}
