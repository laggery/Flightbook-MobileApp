import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonInput, IonButtons, IonContent, IonItem, IonButton, IonTextarea, IonIcon, IonModal, IonDatetime, IonPopover, ModalController } from "@ionic/angular/standalone";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GliderCheck } from 'src/app/glider/shared/glider.model';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
  imports: [
    IonDatetime,
    IonModal,
    TranslateModule,
    IonIcon,
    IonTextarea,
    IonButton,
    IonItem,
    IonContent,
    IonButtons,
    IonInput,
    IonTitle,
    IonToolbar,
    IonHeader,
    DatePipe,
    FormsModule
  ]
})
export class CheckComponent {

  @Input() gliderCheck: GliderCheck;
  language: string;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) {
    this.language = this.translate.currentLang;
  }

  closeCheckModal() {
    this.modalCtrl.dismiss(
      { type: 'close' }
    );
  }

  saveCheck() {
    this.modalCtrl.dismiss(
      { type: 'save', gliderCheck: this.gliderCheck }
    );
  }

  changeDate(event: CustomEvent) {
    this.gliderCheck.date = event.detail.value ? new Date(event.detail.value) : new Date();
  }
}
