import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Glider } from 'flightbook-commons-library';

@Component({
  selector: 'glider-form',
  templateUrl: 'glider-form.html'
})
export class GliderFormComponent {
  @Input()
  glider: Glider;
  @Output()
  saveGlider = new EventEmitter<Glider>();

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) {
  }

  async saveElement(loginForm: any) {
    if (loginForm.valid) {
      this.saveGlider.emit(this.glider);
    } else {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.errortitle'),
        message: this.translate.instant('message.mendatoryFields'),
        buttons: [this.translate.instant('buttons.done')]
      });
      await alert.present();
    }
  }

  cancelButton() {
    this.glider.buyDate = null;
  }

}
