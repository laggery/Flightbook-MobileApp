import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from 'flightbook-commons-library';

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
   * Routerlink to navigate to
   */
  @Input() routerLink: string;

  /**
   * Flight data to show
   */
  @Input() flights$: Observable<Flight[]>;

  /**
   * Toggle
   */
  @Input() isStatistic: boolean;


  constructor() { }

  ngOnInit() {}

}
