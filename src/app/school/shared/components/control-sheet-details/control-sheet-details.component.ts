import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController, IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-control-sheet-details',
    templateUrl: './control-sheet-details.component.html',
    styleUrls: ['./control-sheet-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        TranslateModule,
    ],
})
export class ControlSheetDetailsComponent {

  @Input() type: string;
  @Input() key: string;

  constructor(
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  close() {
    return this.modalCtrl.dismiss();
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
