import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FlightStatistic } from 'src/app/flight/shared/flightStatistic.model';
import { Flight } from 'src/app/flight/shared/flight.model';
import { FlightService } from 'src/app/flight/shared/flight.service';
import { Router } from '@angular/router';
import { DashboardItemComponent } from '../dashboard-item/dashboard-item.component';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'fb-dashboard-container',
    templateUrl: './dashboard-container.component.html',
    styleUrls: ['./dashboard-container.component.scss'],
    imports: [DashboardItemComponent]
})
export class DashboardContainerComponent implements OnInit {

  flightStatistics$: Observable<FlightStatistic | FlightStatistic[]>;
  flights$: Observable<Flight[]>;

  constructor(
    private flightService: FlightService,
    private paymentService: PaymentService,
    private alertController: AlertController,
    private router: Router,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.flights$ = this.flightService.getState();
    this.flightStatistics$ = this.flightService.getStatistics("global").pipe(
      map(flightStatistic => flightStatistic));
  }

  async openLastFlight() {
    this.flights$
      .pipe(take(1))
      .subscribe((flightArray: Flight[]) => {
        if (flightArray.length > 0) {
          this.router.navigate([`flights/${flightArray[0].id}`], { replaceUrl: true });
        }
      });
  }

  async openAddFlight() {
    if (!this.paymentService.getPaymentStatusValue()?.active && this.flightService.getValue().length >= 25) {
      const alert = await this.alertController.create({
                  header: this.translate.instant('message.infotitle'),
                  message: this.translate.instant('payment.premiumUpgradeRequired'),
                  buttons: [{
                      text: this.translate.instant('buttons.done'),
                  }]
              });
              await alert.present();
      return;
    }
    this.router.navigate([`flights/add`], { replaceUrl: true });
  }

  async openStatistics() {
    this.router.navigate([`flights/statistic`], { replaceUrl: true });
  }
}
