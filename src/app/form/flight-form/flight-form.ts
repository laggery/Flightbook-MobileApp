import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Flight } from '../../flight/flight';
import { Glider } from 'src/app/glider/glider';
import { Place } from 'src/app/place/place';

@Component({
  selector: 'flight-form',
  templateUrl: 'flight-form.html'
})
export class FlightFormComponent implements OnInit{
  @Input()
  flight: Flight;
  @Input()
  gliders: Glider[];
  @Output()
  saveFlight = new EventEmitter<Flight>();

  glider: string

  // private searchStart: string;
  // private searchLanding: string;

  constructor() {}

  ngOnInit() {
    if (this.flight.glider.brand && this.flight.glider.name) {
      this.glider = `${this.flight.glider.brand} ${this.flight.glider.name}`
    }
    if (!this.flight.start) {
      this.flight.start = new Place();
    }
    if (!this.flight.landing) {
      this.flight.landing = new Place();
    }
  }

  onSelectChange(selectedValue: any) {
    this.flight.glider = this.gliders.find(glider => glider.id === +selectedValue.detail.value);
    this.glider = `${this.flight.glider.brand} ${this.flight.glider.name}`
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
