import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Place } from '../../models/place';

@Component({
  selector: 'place-form',
  templateUrl: 'place-form.html'
})
export class PlaceFormComponent {

  @Input()
  place: Place;
  @Output()
  savePlace = new EventEmitter<Place>();

  constructor() {
  }

  saveElement(){
    this.savePlace.emit(this.place);
  }

}
