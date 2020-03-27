import { Component, OnInit } from '@angular/core';
import { Place } from '../place';

@Component({
  selector: 'app-place-add',
  templateUrl: './place-add.page.html',
  styleUrls: ['./place-add.page.scss'],
})
export class PlaceAddPage implements OnInit {
  private place: Place;

  constructor() {
    this.place = new Place();
  }

  ngOnInit() {
  }

  savePlace(place: Place) {
    console.log('save place');
  }

}
