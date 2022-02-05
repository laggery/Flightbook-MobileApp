import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from 'src/app/flight/shared/flight.model';
import { FlightStatistic } from 'src/app/flight/shared/flightStatistic.model';

@Component({
  selector: 'fb-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss'],
})
export class DashboardItemComponent implements OnInit {

  /**
   * Icon of the menu item
   */
  @Input() icon: string;

  /**
   * Label of the menu item
   */
  @Input() label: string;

  /**
   * Flight data to show
   */
  @Input() flights$?: Observable<Flight[]>;

  /**
   * Flight statistic to show
   */
  @Input() flightStatistics$?: Observable<FlightStatistic[]>;

  /**
   * Toggle
   */
  @Input() isStatistic: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
