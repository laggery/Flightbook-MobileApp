import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { Flight } from 'src/app/core/domain/flight';
import { Glider } from 'src/app/core/domain/glider';
import { Place } from 'src/app/core/domain/place';

@Component({
  selector: 'flight-form',
  templateUrl: 'flight-form.html'
})
export class FlightFormComponent implements OnInit {

  @Input()
  flight: Flight;
  @Input()
  gliders: Glider[];
  @Input()
  igcFileEdit: any;
  @Input()
  igcFile: string

  @Output()
  saveFlight = new EventEmitter<Flight>();

  glider: string;
  searchStart: string;
  searchLanding: string;
  progress: number;
  uploadSuccessful = false;

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) {
  }

  async ngOnInit() {
    if (this.flight.glider.brand && this.flight.glider.name) {
      this.glider = `${this.flight.glider.brand} ${this.flight.glider.name}`;
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
    this.glider = `${this.flight.glider.brand} ${this.flight.glider.name}`;
    if (!this.flight.glider.tandem) {
      this.flight.price = null;
    }
  }

  async submitForm({ valid }: NgForm) {
    if (valid) {
      this.formatDate();
      this.saveFlight.emit(this.flight);
    } else {
      await this.showAlert();
    }
  }

  private async showAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('message.errortitle'),
      message: this.translate.instant('message.mendatoryFields'),
      buttons: [this.translate.instant('buttons.done')]
    });
    await alert.present();
  }

  private formatDate() {
    const validNumber = !Number.isNaN(Date.parse(this.flight.time));
    if (validNumber) {
      this.flight.time = moment(this.flight.time).format('HH:mm:ss');
    }
  }

  setDefaultTime() {
    if (!this.flight.time) {
      const time = new Date();
      time.setHours(0);
      time.setMinutes(0);
      time.setSeconds(0);
      this.flight.time = time.toDateString();
    }
  }

  cancelButton() {
    this.flight.time = null;
  }

  setFilteredStart(event: any) {
    this.searchStart = event.target.value;
  }

  setFilteredLanding(event: any) {
    this.searchLanding = event.target.value;
  }

  setStartInput(event: any) {
    this.flight.start.name = event.name;
  }

  setLandingInput(event: any) {
    this.flight.landing.name = event.name;
  }
}
