import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Browser } from '@capacitor/browser';
import { UpdateStatus, VersionCheckResponse } from '../../services/version-check.service';
import { addIcons } from 'ionicons';
import { alertCircle, informationCircle } from 'ionicons/icons';
import { NativeMarket } from "@capacitor-community/native-market";

@Component({
  selector: 'app-update-prompt',
  templateUrl: './update-prompt.component.html',
  styleUrls: ['./update-prompt.component.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonFooter,
    TranslateModule
  ]
})
export class UpdatePromptComponent {
  @Input() updateInfo: VersionCheckResponse;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    addIcons({ alertCircle, informationCircle });
  }

  get isForceUpdate(): boolean {
    return this.updateInfo?.status === UpdateStatus.FORCE_UPDATE;
  }

  get isOptionalUpdate(): boolean {
    return this.updateInfo?.status === UpdateStatus.OPTIONAL_UPDATE;
  }

  async updateNow() {
    if (this.updateInfo?.app_id) {
      try {
        NativeMarket.openStoreListing({
          appId: this.updateInfo.app_id,
        });
      } catch (error) {
        this.alertController.create({
          header: this.translate.instant('message.errortitle'),
          message: this.translate.instant('message.error'),
          buttons: [this.translate.instant('buttons.done')]
        }).then((alert: any) => {
          alert.present();
        });
      }

    }
  }

  dismiss() {
    if (!this.isForceUpdate) {
      this.modalController.dismiss();
    }
  }
}
