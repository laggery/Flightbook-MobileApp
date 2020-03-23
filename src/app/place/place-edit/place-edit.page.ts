import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../models/place';

@Component({
  selector: 'app-place-edit',
  templateUrl: './place-edit.page.html',
  styleUrls: ['./place-edit.page.scss'],
})
export class PlaceEditPage implements OnInit {
  private placeId: number;
  place: Place;

  constructor(private activeRoute: ActivatedRoute) {
    // TODO replace with data
    this.placeId = +this.activeRoute.snapshot.paramMap.get('id');
    this.place = new Place();
    this.place.id = this.placeId;
    this.place.name = 'test 1';
    this.place.altitude = 1;
  }

  ngOnInit() {
  }

  savePlace(place: Place) {
    console.log('save place');
  }

}
