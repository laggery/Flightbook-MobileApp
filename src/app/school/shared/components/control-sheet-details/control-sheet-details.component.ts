import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-control-sheet-details',
  templateUrl: './control-sheet-details.component.html',
  styleUrls: ['./control-sheet-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
