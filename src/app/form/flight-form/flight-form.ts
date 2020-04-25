import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Flight } from '../../flight/flight';
import { Glider } from 'src/app/glider/glider';

@Component({
  selector: 'flight-form',
  templateUrl: 'flight-form.html'
})
export class FlightFormComponent {
  @Input()
  flight: Flight;
  @Input()
  gliders: Glider[];
  @Output()
  saveFlight = new EventEmitter<Flight>();

  // private searchStart: string;
  // private searchLanding: string;

  constructor() {
  }

  saveElement(loginForm: any) {
    if (loginForm.valid) {
      this.saveFlight.emit(this.flight);
    }
  }

  setDefaultTime() {
    if (!this.flight.time) {
      const time = new Date(0);
      time.setHours(0);
      this.flight.time = time.toISOString();
    }
  }

  cancelButton() {
    this.flight.time = null;
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
