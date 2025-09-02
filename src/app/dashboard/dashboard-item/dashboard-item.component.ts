import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FlightStatistic } from 'src/app/flight/shared/flightStatistic.model';
import { NgIf, AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonCard, IonIcon } from "@ionic/angular/standalone";
import { FlightStore } from 'src/app/flight/shared/flight.store';

@Component({
    selector: 'fb-dashboard-item',
    templateUrl: './dashboard-item.component.html',
    styleUrls: ['./dashboard-item.component.scss'],
    imports: [
        NgIf,
        TranslateModule,
        AsyncPipe,
        IonCard,
        IonIcon
    ]
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
    public flights = this.flightStore.flights;

    /**
     * Flight statistic to show
     */
    @Input() flightStatistics$?: Observable<FlightStatistic[]>;

    /**
     * Toggle
     */
    @Input() type: string = "addFlight";

    constructor(private flightStore: FlightStore) {
    }

    ngOnInit() {
    }

}
