import { Component, OnInit } from '@angular/core';
import { Flight } from '../flight';
import { NavController } from '@ionic/angular';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.page.html',
  styleUrls: ['./flight-list.page.scss'],
})
export class FlightListPage implements OnInit {
  flights: Flight[] = [];
  limit = 20;

  constructor(
    public navCtrl: NavController,
    private flightService: FlightService
  ) {
    if (this.flightService.flights.length === 0) {
      this.flightService.getFlights({ limit: this.limit }).subscribe((res: Flight[]) => {
        this.flights.push(...this.flightService.flights);
      });
    }
  }

  ngOnInit() {
  }

  loadData(event: any) {
    this.flightService.getFlights({ limit: this.limit, offset: this.flightService.flights.length }).subscribe((res: Flight[]) => {
      event.target.complete();
      this.flights = this.flightService.flights;
      if (res.length < this.limit) {
        event.target.disabled = true;
      }
    });
  }

  ionViewWillEnter() {
    this.flights = this.flightService.flights;
  }

}
