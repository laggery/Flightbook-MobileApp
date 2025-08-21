import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonInput, IonButtons, IonContent, IonItem, IonButton, IonTextarea, IonIcon, IonModal, IonDatetime, IonPopover, ModalController, IonText } from "@ionic/angular/standalone";
import { TranslateModule } from '@ngx-translate/core';
import { Link } from '../../userConfig.model';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  imports: [IonText, 
    TranslateModule,
    FormsModule,
    IonIcon,
    IonButton,
    IonItem,
    IonContent,
    IonButtons,
    IonInput,
    IonTitle,
    IonToolbar,
    IonHeader
  ]
})
export class LinkComponent {

  @Input() link: Link;

  constructor(
    private modalCtrl: ModalController
  ) {
  }

  closeLinkModal() {
    this.modalCtrl.dismiss(
      { type: 'close' }
    );
  }

  saveLink() {
    this.modalCtrl.dismiss(
      { type: 'save', link: this.link }
    );
  }
}
