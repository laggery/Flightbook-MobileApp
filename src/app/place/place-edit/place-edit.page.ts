import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../place';
import { PlaceService } from '../place.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-place-edit',
  templateUrl: './place-edit.page.html',
  styleUrls: ['./place-edit.page.scss'],
})
export class PlaceEditPage implements OnInit {
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

  savePlace(place: Place) {
    this.placeService.putPlace(place).subscribe((res: Place) => {
      // TODO hide loading
      this.router.navigate(['/places'], { replaceUrl: true });
    });
  }

}
