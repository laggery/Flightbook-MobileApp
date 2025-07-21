import { DatePipe, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, LoadingController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonItem, IonGrid, IonRow, IonCol, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { addIcons } from "ionicons";
import { add, filterOutline } from 'ionicons/icons';
import { PassengerConfirmationFormComponent } from '../shared/components/passenger-confirmation-form/passenger-confirmation-form.component';
import { TandemService } from '../shared/tandem.service';
import { PassengerConfirmation } from '../shared/domain/passenger-confirmation.model';

@Component({
  selector: 'app-passenger-confirmation-list',
  templateUrl: './passenger-confirmation-list.page.html',
  styleUrls: ['./passenger-confirmation-list.page.scss'],
  imports: [
    NgIf,
    TranslateModule,
    DatePipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ]
})
export class PassengerConfirmationListPage implements OnInit, OnDestroy {

  unsubscribe$ = new Subject<void>();
  passengerConfirmations: PassengerConfirmation[] = [];
  filtered: boolean;

  constructor(
    private modalCtrl: ModalController,
    private tandemService: TandemService,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
  ) {
    addIcons({ filterOutline, add });
  }

  ngOnInit() {
    this.initialDataLoad();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async openAddPassengerConfirmation() {
    const modal = await this.modalCtrl.create({
      component: PassengerConfirmationFormComponent,
      cssClass: 'passenger-confirmation-form-class',
      componentProps: {
        type: 'add',
        passengerData: new PassengerConfirmation()
      }
    });

    modal.present();
    const { role } = await modal.onWillDismiss();
    if (role == "save") {
      this.savePassengerConfirmation(modal.componentProps.passengerData);
    }
    this.translate.use(localStorage.getItem('language') || navigator.language.split('-')[0]);
  }

  async openFilter() {

  }

  async itemTapped(event: MouseEvent, passengerConfirmation: PassengerConfirmation) {
    const modal = await this.modalCtrl.create({
      component: PassengerConfirmationFormComponent,
      cssClass: 'passenger-confirmation-form-class',
      componentProps: {
        type: 'view',
        passengerData: passengerConfirmation
      }
    });

    modal.present();
    const { role } = await modal.onWillDismiss();
    if (role == "delete") {
      this.deletePassengerConfirmation(modal.componentProps.passengerData);
    }
    this.translate.use(localStorage.getItem('language') || navigator.language.split('-')[0]);
  }

  private async initialDataLoad() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();

    try {
      this.passengerConfirmations = await firstValueFrom(
        this.tandemService.getPassengerConfirmations({ limit: this.tandemService.defaultLimit })
      );
    } catch (error) {
      console.error('Error loading appointments', error);
    } finally {
      await loading.dismiss();
    }
  }

  loadData(event: any) {
    this.tandemService.getPassengerConfirmations({
      limit: this.tandemService.defaultLimit,
      offset: this.passengerConfirmations.length
    })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: PassengerConfirmation[]) => {
        event.target.complete();
        if (res.length < this.tandemService.defaultLimit) {
          event.target.disabled = true;
        }
        this.passengerConfirmations.push(...res);
      });
  }

  private async savePassengerConfirmation(passengerData: PassengerConfirmation) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.save')
    });
    await loading.present();
    this.tandemService.postPassengerConfirmations(passengerData).subscribe({
      next: (response) => {
        this.initialDataLoad();
      },
      error: (error) => {
        console.error('Error saving passenger confirmation:', error);
      },
      complete: async () => {
        await loading.dismiss();
      }
    });
  }

  private async deletePassengerConfirmation(passengerData: PassengerConfirmation) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.delete')
    });
    await loading.present();
    this.tandemService.deletePassengerConfirmation(passengerData.id).subscribe({
      next: (response) => {
        this.initialDataLoad();
      },
      error: (error) => {
        console.error('Error saving passenger confirmation:', error);
      },
      complete: async () => {
        await loading.dismiss();
      }
    });
  }

}
