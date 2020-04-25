import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Flight } from '../flight';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../flight.service';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { Glider } from 'src/app/glider/glider';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.scss'],
})
export class FlightEditComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private flightId: number;
  flight: Flight;
  // gliders: Glider[];

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private flightService: FlightService
  ) {
    this.flightId = +this.activeRoute.snapshot.paramMap.get('id');
    this.flight = this.flightService.getValue().find(flight => flight.id === this.flightId);
    // console.log(this.flight);
    this.flight = _.cloneDeep(this.flight);
    if (!this.flight) {
      this.router.navigate(['/flights'], { replaceUrl: true });
    }
    // const g1 = new Glider();
    // g1.id = 1;
    // g1.brand = "test";
    // g1.name = "test-name";
    // g1.tandem = false;
    // this.gliders.push(g1);

    // const g2 = new Glider();
    // g2.id = 1;
    // g2.brand = "test2";
    // g2.name = "test-name2";
    // g2.tandem = false;
    // this.gliders.push(g2);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  saveFlight(flight: Flight) {
    // this.flightService.putFlight(flight).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Flight) => {
    //   // TODO hide loading
    //   this.router.navigate(['/flights'], { replaceUrl: true });
    // });
  }

}
