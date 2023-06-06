import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Glider } from 'src/app/glider/shared/glider.model';

@Component({
  selector: 'glider-form',
  templateUrl: 'glider-form.html'
})
export class GliderFormComponent implements OnInit {
  @Input()
  glider: Glider;
  @Output()
  saveGlider = new EventEmitter<Glider>();
  language;
  displayArchived = false;

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.language = this.translate.currentLang;
  }

  ngOnInit() {
    if (this.glider.name) {
      this.displayArchived = true;
    }
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

  changeBuyDate(event: CustomEvent) {
      this.glider.buyDate = event.detail.value ? event.detail.value : new Date();
  }

  cancelButton() {
    this.glider.buyDate = null;
  }

}
