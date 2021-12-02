import { Component, Input, OnInit } from '@angular/core';
import { Flight, Glider } from 'flightbook-commons-library';

@Component({
  selector: 'fb-glider-select',
  templateUrl: './glider-select.component.html',
  styleUrls: ['./glider-select.component.scss'],
})
export class GliderSelectComponent implements OnInit {

  @Input()
  gliders: Glider[];

  @Input()
  flight: Flight;

  glider: string;

  constructor() { }

  ngOnInit() {
    if (this.flight.glider.brand && this.flight.glider.name) {
      this.glider = `${this.flight.glider.brand} ${this.flight.glider.name}`;
    }
  }

  onSelectChange(selectedValue: any) {
    this.flight.glider = this.gliders.find(glider => glider.id === +selectedValue.detail.value);
    this.glider = `${this.flight.glider.brand} ${this.flight.glider.name}`;
    if (!this.flight.glider.tandem) {
      this.flight.price = null;
    }
  }

}
