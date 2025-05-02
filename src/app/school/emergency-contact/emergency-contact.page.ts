import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonInput, IonButton, IonItem, IonText, IonTextarea, LoadingController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmergencyContact } from '../shared/emergency-contact.model';
import { PhoneNumberComponent } from 'src/app/shared/components/phone-number/phone-number.component';
import { SchoolService } from '../shared/school.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-emergency-contact',
  templateUrl: './emergency-contact.page.html',
  styleUrls: ['./emergency-contact.page.scss'],
  imports: [
    TranslateModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonText,
    IonTextarea,
    PhoneNumberComponent
  ]
})
export class EmergencyContactPage implements OnInit, OnDestroy {
  emergencyContact: EmergencyContact;
  unsubscribe$ = new Subject<void>();

  constructor(
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    private schoolService: SchoolService,
  ) {
    this.emergencyContact = new EmergencyContact();
  }

  ngOnInit() {
    this.initialDataLoad();
  }

  private async initialDataLoad() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.schoolService.getEmergencyContacts().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: async (emergencyContact: EmergencyContact[]) => {
        if (emergencyContact.length > 0) {
          this.emergencyContact = emergencyContact[0];
        }
        await loading.dismiss();
      },
      error: async (error: any) => {
        await loading.dismiss();
      }
    });
  }

  async save() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();

    this.schoolService.postEmergencyContact(this.emergencyContact)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (result) => {
          loading.dismiss();
          this.emergencyContact = result;
        },
        error: () => {
          loading.dismiss();
        }
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
