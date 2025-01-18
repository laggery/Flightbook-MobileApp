import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from 'src/app/flight/shared/flight.model';
import { FlightStatistic } from 'src/app/flight/shared/flightStatistic.model';
import { NgIf, AsyncPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'fb-dashboard-item',
    templateUrl: './dashboard-item.component.html',
    styleUrls: ['./dashboard-item.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        IonicModule,
        TranslateModule,
        AsyncPipe,
    ],
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
