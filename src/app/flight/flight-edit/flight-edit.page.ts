import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Flight } from '../flight';
import { Glider } from 'src/app/glider/glider';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../flight.service';
import { GliderService } from 'src/app/glider/glider.service';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.page.html',
  styleUrls: ['./flight-edit.page.scss'],
})
export class FlightEditPage implements OnInit {
  unsubscribe$ = new Subject<void>();
  private flightId: number;
  flight: Flight;
  gliders: Glider[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private gliderService: GliderService
  ){
    this.flightId = +this.activeRoute.snapshot.paramMap.get('id');
    this.flight = this.flightService.getValue().find(flight => flight.id === this.flightId);
    this.flight = _.cloneDeep(this.flight);
    if (!this.flight) {
      this.router.navigate(['/flights'], { replaceUrl: true });
    }

    if (this.gliderService.isGliderlistComplete) {
      this.gliders = this.gliderService.getValue();
    } else {
      this.gliderService.getGliders().pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
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
    this.flightService.putFlight(flight).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Flight) => {
      // TODO hide loading
      this.router.navigate(['/flights'], { replaceUrl: true });
    });
  }

}
