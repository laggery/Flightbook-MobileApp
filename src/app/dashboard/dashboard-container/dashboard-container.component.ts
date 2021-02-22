import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight, FlightService } from 'flightbook-commons-library';

@Component({
  selector: 'fb-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
})
export class DashboardContainerComponent implements OnInit {

  flights$: Observable<Flight[]>;

  constructor(private flightService: FlightService,
  ) {
  }

  ngOnInit() {
    this.flights$ = this.flightService.getState();
  }

}
