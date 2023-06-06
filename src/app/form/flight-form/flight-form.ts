import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { Place } from 'src/app/place/shared/place.model';
import { Flight } from 'src/app/flight/shared/flight.model';
import { Glider } from 'src/app/glider/shared/glider.model';

@Component({
  selector: 'flight-form',
  templateUrl: 'flight-form.html',
  styleUrls: ['./flight-form.scss'],
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

  searchStart: string;
  searchLanding: string;
  progress: number;
  uploadSuccessful = false;
  language;

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.language = this.translate.currentLang;
  }

  async ngOnInit() {
    if (!this.flight.start) {
      this.flight.start = new Place();
    }
    if (!this.flight.landing) {
      this.flight.landing = new Place();
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
      this.flight.time = "00:00"
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
