import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Flight } from '../../models/flight';

@Component({
  selector: 'flight-form',
  templateUrl: 'flight-form.html'
})
export class FlightFormComponent {
  @Input()
  flight: Flight;
  @Input()
  gliders: any;
  // @Input()
  // places: any;
  @Output()
  saveFlight = new EventEmitter<Flight>();

  // private searchStart: string;
  // private searchLanding: string;

  constructor() {
  }

  saveElement() {
    this.saveFlight.emit(this.flight);
  }

  // setFilteredStart(event) {
  //   this.searchStart = event.target.value;
  // }

  // setFilteredLanding(event) {
  //   this.searchLanding = event.target.value;
  // }

  // setStartInput(event) {
  //   this.flight.start.name = event.name;
  // }

  // setLandingInput(event) {
  //   this.flight.landing.name = event.name;
  // }

}
