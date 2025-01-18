import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from "ionicons";
import { close } from "ionicons/icons";

@Component({
    selector: 'app-control-sheet-details',
    templateUrl: './control-sheet-details.component.html',
    styleUrls: ['./control-sheet-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        NgIf,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonIcon,
        IonContent
    ],
})
export class ControlSheetDetailsComponent {

    @Input() type: string;
    @Input() key: string;

    constructor(
        private modalCtrl: ModalController,
        private sanitizer: DomSanitizer
    ) {
        addIcons({ close });
    }

    close() {
        return this.modalCtrl.dismiss();
    }

    getSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
