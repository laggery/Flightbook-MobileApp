import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../place';
import { Router } from '@angular/router';
import { PlaceService } from '../place.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-place-add',
  templateUrl: './place-add.page.html',
  styleUrls: ['./place-add.page.scss'],
})
export class PlaceAddPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private place: Place;

  constructor(
    private router: Router,
    private placeService: PlaceService
  ) {
    this.place = new Place();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  savePlace(place: Place) {
    this.placeService.postPlace(place).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Place) => {
      // TODO hide loading
      this.router.navigate(['/places'], { replaceUrl: true });
    });
  }

}
