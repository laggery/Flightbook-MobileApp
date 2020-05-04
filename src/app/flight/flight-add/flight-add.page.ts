import { Component, OnInit, OnDestroy } from '@angular/core';
import { Flight } from '../flight';
import { Glider } from '../../glider/glider';
import { Place } from '../../place/place';
import { Subject } from 'rxjs';
import { FlightService } from '../flight.service';
import { GliderService } from 'src/app/glider/glider.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-flight-add',
  templateUrl: './flight-add.page.html',
  styleUrls: ['./flight-add.page.scss'],
})
export class FlightAddPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private flight: Flight;
  private gliders: Glider[] = [];

  constructor(
    private router: Router,
    private flightService: FlightService,
    private gliderService: GliderService,
    private alertController: AlertController,
    private translate: TranslateService
    ) {
    this.flight = new Flight();
    this.flight.date = new Date().toISOString();
    this.flight.glider = new Glider();
    this.flight.start = new Place();
    this.flight.landing = new Place();

    if (this.flightService.getValue().length > 0) {
      this.flight.glider = this.flightService.getValue()[0].glider
    } else {
      this.flightService.getFlights({ limit: 1, store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Flight[]) => {
        this.flight.glider = res[0].glider
      });
    }

    if (this.gliderService.isGliderlistComplete) {
      this.noGliderCheck();
      this.gliders = this.gliderService.getValue();
    } else {
      this.gliderService.getGliders().pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
        this.noGliderCheck();
        this.gliderService.isGliderlistComplete = true;
        this.gliders = this.gliderService.getValue();
      });
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  saveFlight(flight: Flight) {
    this.flightService.postFlight(flight).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Flight) => {
      // TODO hide loading
      this.router.navigate(['/flights'], { replaceUrl: true });
    });
  }

  private async noGliderCheck() {
    if (this.gliderService.getValue().length === 0) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.noglidertitle'),
        message: this.translate.instant('message.noglider'),
        buttons: ['OK']
      });
  
      await alert.present();
      this.router.navigate(['/gliders/add'], { replaceUrl: true });
    }
  }
}
