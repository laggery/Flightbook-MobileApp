import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../place';
import { PlaceService } from '../place.service';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-place-edit',
  templateUrl: './place-edit.page.html',
  styleUrls: ['./place-edit.page.scss'],
})
export class PlaceEditPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private placeId: number;
  place: Place;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService
  ) {
    this.placeId = +this.activeRoute.snapshot.paramMap.get('id');
    this.place = this.placeService.getValue().find(place => place.id === this.placeId);
    this.place = _.cloneDeep(this.place);
    if (!this.place) {
      this.router.navigate(['/places'], { replaceUrl: true });
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  savePlace(place: Place) {
    this.placeService.putPlace(place).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Place) => {
      // TODO hide loading
      this.router.navigate(['/places'], { replaceUrl: true });
    });
  }

}
