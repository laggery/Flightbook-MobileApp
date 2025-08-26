import { Component, OnInit, effect, inject, Injector, runInInjectionContext } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlightStatistic } from 'src/app/flight/shared/flightStatistic.model';
import { FlightStore } from 'src/app/flight/shared/flight.store';
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
  public flights = this.flightStore.flights;
  private injector = inject(Injector);

  constructor(
    private flightStore: FlightStore,
    private paymentService: PaymentService,
    private alertController: AlertController,
    private router: Router,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    // Run effect in proper injection context using the class-level injector
    runInInjectionContext(this.injector, () => {
      effect(() => {
        // Update statistics whenever flights change
        this.flightStore.flights()
        this.flightStatistics$ = this.flightStore.getStatistics("global").pipe(
          map(flightStatistic => flightStatistic)
        );
      });
    });
  }

  async openLastFlight() {
    this.flights().length > 0 && this.router.navigate([`flights/${this.flights()[0].id}`]);
  }

  async openAddFlight() {
    if (!this.paymentService.getPaymentStatusValue()?.active && this.flightStore.flights().length >= 25) {
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
    this.router.navigate([`flights/add`]);
  }

  async openStatistics() {
    this.router.navigate([`flights/statistic`]);
  }
}
