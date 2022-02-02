import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Place } from 'src/app/core/domain/place';

@Component({
  selector: 'place-form',
  templateUrl: 'place-form.html'
})
export class PlaceFormComponent {

  @Input()
  place: Place;
  @Output()
  savePlace = new EventEmitter<Place>();

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) {
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
