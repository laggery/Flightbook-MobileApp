import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Place } from 'src/app/place/shared/place.model';
import { Countries, Country } from 'src/app/place/shared/place.countries';

@Component({
  selector: 'place-form',
  templateUrl: 'place-form.html'
})
export class PlaceFormComponent {

  @Input()
  place: Place;
  @Output()
  savePlace = new EventEmitter<Place>();

  countries: Country[] = Countries;
  lang : string;

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.lang = this.translate.currentLang;
    this.countries.sort((a,b) => a.name[this.lang].localeCompare(b.name[this.lang]));
  }

  async saveElement(loginForm: any) {
    if (loginForm.valid) {
      this.savePlace.emit(this.place);
    } else {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.errortitle'),
        message: this.translate.instant('message.mendatoryFields'),
        buttons: [this.translate.instant('buttons.done')]
      });
      await alert.present();
    }
  }

}
