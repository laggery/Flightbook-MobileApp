import { Component, Input, } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon, IonLabel } from "@ionic/angular/standalone";

/**
 * Custom menu item component for flightbook
 */
@Component({
    selector: 'fb-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    imports: [TranslateModule, IonIcon, IonLabel]
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
