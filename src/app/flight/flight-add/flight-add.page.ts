import { Component, OnInit } from '@angular/core';
import { Flight } from '../../models/flight';
import { Glider } from '../../models/glider';
import { Place } from '../../models/place';

@Component({
  selector: 'app-flight-add',
  templateUrl: './flight-add.page.html',
  styleUrls: ['./flight-add.page.scss'],
})
export class FlightAddPage implements OnInit {
  private flight: Flight;
  private gliders = [];

  constructor() {
    this.flight = new Flight();
    const today = new Date();
    this.flight.date = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + (today.getDate())).slice(-2);
    this.flight.start = new Place();
    this.flight.landing = new Place();

    const g1 = new Glider();
    g1.id = 1;
    g1.brand = 'Ozone';
    g1.name = 'Delta 2';
    g1.tandem = false;
    g1.buy_date = new Date();
    g1.user_id = 1;

    this.gliders.push(g1);
  }

  ngOnInit() {
  }

  saveFlight(flight: Flight) {
    console.log('save flight');
  }

}
