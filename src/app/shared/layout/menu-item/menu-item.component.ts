import { Component, Input, } from '@angular/core';

/**
 * Custom menu item component for flightbook
 */
@Component({
  selector: 'fb-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {

  /**
   * Icon of the menu item
   */
  @Input() icon: string;

  /**
   * Label of the menu item
   */
  @Input() label: string;

}
