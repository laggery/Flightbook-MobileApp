import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, IonToggle, ModalController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { Subject } from 'rxjs';
import SignaturePad from 'signature_pad';
import { PassengerConfirmation } from '../../domain/passenger-confirmation.model';
import { ColorService } from 'src/app/shared/services/color.service';

@Component({
  selector: 'app-passenger-confirmation-form',
  templateUrl: './passenger-confirmation-form.component.html',
  styleUrl: './passenger-confirmation-form.component.scss',
  imports: [
    FormsModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonInput,
    IonItem,
    IonText,
    IonLabel,
    IonToggle
  ]
})
export class PassengerConfirmationFormComponent implements OnInit, OnDestroy, AfterViewInit {
  unsubscribe$ = new Subject<void>();
  passengerData: PassengerConfirmation;
  type: 'add' | 'view';

  signaturePad!: SignaturePad;
  @ViewChild('signatureCanvas') canvasEl!: ElementRef;

  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private colorService: ColorService
  ) {
    addIcons({ close });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement, {
      penColor: this.colorService.getIonTextColor()
    });
    if (this.type === 'view' && this.passengerData.signature) {
      this.signaturePad.fromDataURL(this.passengerData.signature);
    }
  }

  get dateString(): string {
    if (!this.passengerData?.date) return '';

    const date = this.passengerData.date instanceof Date
      ? this.passengerData.date
      : new Date(this.passengerData.date);

    return date.toISOString().split('T')[0];
  }

  savePassengerConfirmation(form: NgForm) {
    this.passengerData.signature = this.signaturePad.toDataURL();
    this.passengerData.signatureMimeType = 'image/png';
    this.modalController.dismiss(form.value, 'save');
  }

  delete() {
    this.modalController.dismiss(this.passengerData, 'delete');
  }

  close() {
    this.modalController.dismiss();
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  setLanguage(lang: string) {
    this.translate.use(lang)
  }
}
