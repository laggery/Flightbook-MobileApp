import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Signal } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonItem, IonGrid, IonRow, IonCol, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { Subject, Observable, firstValueFrom } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';
import { FlightFilterComponent } from 'src/app/form/flight-filter/flight-filter.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { FileOpener } from '@capacitor-community/file-opener';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { XlsxExportService } from '../../shared/services/xlsx-export.service';
import { PdfExportService } from 'src/app/shared/services/pdf-export.service';
import { Flight } from '../shared/flight.model';
import { FlightService } from '../shared/flight.service';
import { AccountService } from 'src/app/account/shared/account.service';
import { FlightStatistic } from '../shared/flightStatistic.model';
import { SchoolService } from 'src/app/school/shared/school.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FlagsModule } from 'nxt-flags';
import { addIcons } from "ionicons";
import { add, filterOutline, trash } from "ionicons/icons";
import { PaymentService } from 'src/app/shared/services/payment.service';
import { FlightValidationState } from '../shared/flight-validation-state';

@Component({
    selector: 'app-flight-list',
    templateUrl: './flight-list.page.html',
    styleUrls: ['./flight-list.page.scss'],
    imports: [
        FlagsModule,
        AsyncPipe,
        DatePipe,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonButton,
        IonIcon,
        IonContent,
        IonItem,
        IonGrid,
        IonRow,
        IonCol,
        IonLabel,
        IonList,
        IonItemOptions,
        IonItemOption,
        IonItemSliding,
        IonInfiniteScroll,
        IonInfiniteScrollContent
    ]
})
export class FlightListPage implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
    @ViewChild(IonContent) content: IonContent;
    unsubscribe$ = new Subject<void>();
    flights$: Observable<Flight[]>;

    public FlightValidationState = FlightValidationState;
    
    get filtered(): Signal<boolean> {
        return this.flightService.filtered$;
    }

    constructor(
        public navCtrl: NavController,
        private flightService: FlightService,
        private accountService: AccountService,
        private schoolService: SchoolService,
        private modalCtrl: ModalController,
        private alertController: AlertController,
        private translate: TranslateService,
        private loadingCtrl: LoadingController,
        private xlsxExportService: XlsxExportService,
        private pdfExportService: PdfExportService,
        private paymentService: PaymentService,
        private router: Router
    ) {
        this.flights$ = this.flightService.getState();

        if (this.flightService.getValue().length === 0) {
            this.initialDataLoad();
        }
        addIcons({ add, filterOutline, trash });
    }

    private async initialDataLoad() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });
        await loading.present();
        let limit = this.flightService.defaultLimit;
        if (window.innerHeight > 1024) {
            limit += Math.ceil((window.innerHeight - 1024) / 47) + 2;
        }
        this.flightService.getFlights({ limit: limit, clearStore: true })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(async (res: Flight[]) => {
                // @hack for hide export item
                setTimeout(async () => {
                    await this.content.scrollToPoint(0, 48);
                    await loading.dismiss();
                }, 1);
            }, async (error: any) => {
                await loading.dismiss();
            });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.content.scrollToPoint(0, 48);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    loadData(event: any) {
        this.flightService.getFlights({ limit: this.flightService.defaultLimit, offset: this.flightService.getValue().length })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: Flight[]) => {
                event.target.complete();
                if (res.length < this.flightService.defaultLimit) {
                    event.target.disabled = true;
                }
            });
    }

    itemTapped(event: MouseEvent, flight: Flight) {
        this.navCtrl.navigateForward(`flights/${flight.id}`);
    }

    async deleteItem(flight: Flight){
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.deleteflight')
        });
        await loading.present();

        this.flightService.deleteFlight(flight).pipe(
            concatMap(() => this.flightService.getFlights({ limit: this.flightService.defaultLimit, clearStore: true }))
        ).pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: async (res: Flight[]) => {
                await loading.dismiss();
            },
            error: (async (resp: any) => {
                await loading.dismiss();
            })
        });
    }

    async openFilter() {
        const modal = await this.modalCtrl.create({
            component: FlightFilterComponent,
            cssClass: 'flight-filter-class',
            componentProps: {
                infiniteScroll: this.infiniteScroll,
                type: 'FlightListPage'
            }
        });

        this.modalOnDidDismiss(modal);

        return await modal.present();
    }

    async modalOnDidDismiss(modal: HTMLIonModalElement) {
        modal.onDidDismiss().then((resp: any) => {
            this.content.scrollToPoint(0, 48);
        });
    }

    async xlsxExport() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });
        await loading.present();
        this.flightService.getFlights({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
            res = res.sort((a: Flight, b: Flight) => b.number - a.number);
            if (Capacitor.isNativePlatform()) {
                try {
                    const data: any = await this.xlsxExportService.generateFlightsXlsxFile(res, { bookType: 'xlsx', type: 'base64' });
                    const path = `xlsx/flights_export.xlsx`;

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
                const data: any = await this.xlsxExportService.generateFlightsXlsxFile(res, { bookType: 'xlsx', type: 'array' });
                await loading.dismiss();
                this.xlsxExportService.saveExcelFile(data, `flights_export_${Date.now()}.xlsx`);
            }
        }, async (error: any) => {
            await loading.dismiss();
        });
    }

    async pdfExport() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });
        await loading.present();
        const res = <FlightStatistic[]>await firstValueFrom(this.flightService.getStatistics("global"));
        const stat = res[0];
        this.flightService.getFlights({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
            res = res.sort((a: Flight, b: Flight) => b.number - a.number);
            res.reverse();
            const user = await firstValueFrom(this.accountService.currentUser());
            const schools = await this.schoolService.getSchools();
            const pdfObj: TCreatedPdf = await this.pdfExportService.generatePdf(res, stat, user, schools.length !== 0, 'https://m.flightbook.ch');
            if (Capacitor.isNativePlatform()) {
                pdfObj.getBase64(async (data) => {
                    try {
                        const path = `pdf/flightbook.pdf`;

                        const result = await Filesystem.writeFile({
                            path,
                            data,
                            directory: Directory.External,
                            recursive: true
                        });
                        await loading.dismiss();
                        await FileOpener.open({
                            filePath: result.uri,
                            contentType: 'application/pdf'
                        });
                    } catch (e) {
                        loading.dismiss();
                        const alert = await this.alertController.create({
                            header: this.translate.instant('message.infotitle'),
                            message: e,
                            buttons: [this.translate.instant('buttons.done')]
                        });
                        await alert.present();
                    }
                });
            } else {
                await loading.dismiss();
                pdfObj.download(`flightbook_${Date.now()}.pdf`);
            }
        }, async (error: any) => {
            await loading.dismiss();
        });
    }

    async openAddFlight() {
        if (!this.paymentService.getPaymentStatusValue()?.active && this.flightService.getValue().length >= 25) {
          const alert = await this.alertController.create({
                      header: this.translate.instant('message.infotitle'),
                      message: this.translate.instant('payment.premiumUpgradeRequired'),
                      buttons: [{
                          text: this.translate.instant('buttons.done'),
                      }]
                  });
                  await alert.present();
          return;
        }
        this.router.navigate([`flights/add`], { replaceUrl: true });
      }
}
