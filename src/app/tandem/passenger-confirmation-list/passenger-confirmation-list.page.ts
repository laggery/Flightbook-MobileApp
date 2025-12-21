import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, LoadingController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonItem, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, AlertController, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { addIcons } from "ionicons";
import { add, filterOutline } from 'ionicons/icons';
import { PassengerConfirmationFormComponent } from '../shared/components/passenger-confirmation-form/passenger-confirmation-form.component';
import { TandemService } from '../shared/tandem.service';
import { PassengerConfirmation } from '../shared/domain/passenger-confirmation.model';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { Capacitor } from '@capacitor/core';
import { XlsxExportService } from 'src/app/shared/services/xlsx-export.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

@Component({
  selector: 'app-passenger-confirmation-list',
  templateUrl: './passenger-confirmation-list.page.html',
  styleUrls: ['./passenger-confirmation-list.page.scss'],
  imports: [
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
    IonGrid,
    IonRow,
    IonCol,
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
    private alertController: AlertController,
    private translate: TranslateService,
    private paymentService: PaymentService,
    private xlsxExportService: XlsxExportService
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
    if (
      (!this.paymentService.getPaymentStatusValue()?.active && this.passengerConfirmations.length >= 10) ||
      (this.paymentService.getPaymentStatusValue()?.active && this.paymentService.getPaymentStatusValue()?.state == 'EXEMPTED' && this.passengerConfirmations.length >= 10)
    ) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('payment.premiumUpgradeRequiredTandem'),
        buttons: [{
          text: this.translate.instant('buttons.done'),
        }]
      });
      await alert.present();
      return;
    } else if (
      (!this.paymentService.getPaymentStatusValue()?.active && this.passengerConfirmations.length == 0) ||
      (this.paymentService.getPaymentStatusValue()?.active && this.paymentService.getPaymentStatusValue()?.state == 'EXEMPTED' && this.passengerConfirmations.length == 0)
    ) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('payment.passengerConfirmationInfo'),
        buttons: [{
          text: this.translate.instant('buttons.done'),
        }]
      });
      await alert.present();
      await alert.onDidDismiss();
    }

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
      console.error('Error loading passenger confirmations', error);
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

  async xlsxExport() {
    const loading = await this.loadingCtrl.create({
        message: this.translate.instant('loading.loading')
    });
    loading.present();
    this.tandemService.getPassengerConfirmations().pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: PassengerConfirmation[]) => {
        if (Capacitor.isNativePlatform()) {
            try {
                const data: any = await this.xlsxExportService.generatePassengerConfirmationsXlsxFile(res, { bookType: 'xlsx', type: 'base64' });
                const path = `xlsx/passenger_confirmation_export.xlsx`;

                const result = await Filesystem.writeFile({
                    path,
                    data,
                    directory: Directory.External,
                    recursive: true
                });

                await loading.dismiss();

                try {
                    await FileOpener.open({
                        filePath: result.uri,
                        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });
                } catch (error) {
                    if (Capacitor.getPlatform() == "android") {
                        const alert = await this.alertController.create({
                            header: this.translate.instant('message.infotitle'),
                            message: this.translate.instant('message.downloadExcel'),
                            buttons: [this.translate.instant('buttons.done')]
                        });
                        await alert.present();
                    } else {
                        throw error;
                    }
                }
            } catch (e) {
                await loading.dismiss();
                const alert = await this.alertController.create({
                    header: this.translate.instant('message.infotitle'),
                    message: this.translate.instant('message.generationError'),
                    buttons: [this.translate.instant('buttons.done')]
                });
                await alert.present();
            }
        } else {
            const data: any = await this.xlsxExportService.generatePassengerConfirmationsXlsxFile(res, { bookType: 'xlsx', type: 'array' });
            await loading.dismiss();
            this.xlsxExportService.saveExcelFile(data, `passenger_confirmations_export_${Date.now()}.xlsx`);
        }
    }, async (error: any) => {
        await loading.dismiss();
    });
}

}
