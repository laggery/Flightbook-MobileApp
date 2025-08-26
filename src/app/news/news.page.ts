import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, LoadingController, AlertController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonCard } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { SplashScreen } from '@capacitor/splash-screen';
setTimeout(() => {
    SplashScreen.hide();
}, 700);
import { FileOpener } from '@capacitor-community/file-opener'
import { News } from './shared/news.model';
import { XlsxExportService } from '../shared/services/xlsx-export.service';
import { Flight } from '../flight/shared/flight.model';
import { NewsService } from './shared/news.service';
import { GliderService } from '../glider/shared/glider.service';
import { PlaceService } from '../place/shared/place.service';
import { FlightStore } from '../flight/shared/flight.store';
import { PaymentService } from '../shared/services/payment.service';
import { PaymentStatus } from '../account/shared/paymentStatus.model';
import { DashboardContainerComponent } from '../dashboard/dashboard-container/dashboard-container.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { addIcons } from "ionicons";
import { downloadOutline } from "ionicons/icons";

@Component({
    selector: 'app-news',
    templateUrl: './news.page.html',
    styleUrls: ['./news.page.scss'],
    imports: [
        DashboardContainerComponent,
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
        IonCard
    ]
})
export class NewsPage implements OnInit, OnDestroy {
    unsubscribe$ = new Subject<void>();
    newsData$: Observable<News[]>;
    flights$: Observable<Flight[]>;
    paymentStatus: PaymentStatus;

    constructor(
        private menuCtrl: MenuController,
        private alertController: AlertController,
        private translate: TranslateService,
        private newsService: NewsService,
        private gliderService: GliderService,
        private placeService: PlaceService,
        private flightStore: FlightStore,
        private loadingCtrl: LoadingController,
        private xlsxExportService: XlsxExportService,
        private paymentService: PaymentService
    ) {
        this.menuCtrl.enable(true);

        this.paymentService.getPaymentStatus().pipe(takeUntil(this.unsubscribe$)).subscribe((paymentStatus: PaymentStatus) => {
            this.paymentStatus = paymentStatus;
        });
        addIcons({ downloadOutline });
    }

    ngOnInit() {}

    ionViewWillEnter() {
        this.newsData$ = this.newsService.getState();
        if (this.newsService.getValue().length === 0 || this.newsService.getValue()[0].language != this.translate.currentLang || this.flightStore.flights().length === 0) {
            this.initialDataLoad();
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private async initialDataLoad() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });
        await loading.present();
        this.newsService.getNews(this.translate.currentLang).pipe(takeUntil(this.unsubscribe$)).subscribe(async (resp: News[]) => {
            await loading.dismiss();
        }, async (error: any) => {
            await loading.dismiss();
        });
        if (window.innerHeight > 1024) {
            this.flightStore.defaultLimit += Math.ceil((window.innerHeight - 1024) / 47) + 2;
        }
        this.flightStore.getFlights({ limit: this.flightStore.defaultLimit, clearStore: true })
            .pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
            }, async (error: any) => {
                await loading.dismiss();
            });
    }

    async xlsxExport() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });
        await loading.present();
        const promiseList: Promise<any>[] = [];
        promiseList.push(this.flightStore.getFlights({ store: false }).pipe(takeUntil(this.unsubscribe$)).toPromise());
        promiseList.push(this.gliderService.getGliders({ store: false }).pipe(takeUntil(this.unsubscribe$)).toPromise());
        promiseList.push(this.placeService.getPlaces({ store: false }).pipe(takeUntil(this.unsubscribe$)).toPromise());

        Promise.all(promiseList).then(async (res: any) => {
            if (Capacitor.isNativePlatform()) {
                try {
                    const data: any = await this.xlsxExportService.generateFlightbookXlsxFile(res[0], res[1], res[2], {
                        bookType: 'xlsx',
                        type: 'base64'
                    });
                    const path = `xlsx/flightbook_export.xlsx`;

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
                const data: any = await this.xlsxExportService.generateFlightbookXlsxFile(res[0], res[1], res[2], {
                    bookType: 'xlsx',
                    type: 'array'
                });
                await loading.dismiss();
                this.xlsxExportService.saveExcelFile(data, `flightbook_export_${Date.now()}.xlsx`);
            }
        }, async (error: any) => {
            await loading.dismiss();
        });
    }

}
