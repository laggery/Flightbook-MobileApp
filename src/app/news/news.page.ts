import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { SplashScreen } from '@capacitor/splash-screen';
setTimeout(() => {
  SplashScreen.hide();
}, 700);
import { FileOpener } from '@capacitor-community/file-opener'
import { Router } from '@angular/router';
import { News } from './shared/news.model';
import { XlsxExportService } from '../shared/services/xlsx-export.service';
import { Flight } from '../flight/shared/flight.model';
import { NewsService } from './shared/news.service';
import { GliderService } from '../glider/shared/glider.service';
import { PlaceService } from '../place/shared/place.service';
import { FlightService } from '../flight/shared/flight.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  newsData$: Observable<News[]>;
  flights$: Observable<Flight[]>;

  constructor(
    private menuCtrl: MenuController,
    private alertController: AlertController,
    private translate: TranslateService,
    private newsService: NewsService,
    private gliderService: GliderService,
    private placeService: PlaceService,
    private flightService: FlightService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private xlsxExportService: XlsxExportService
  ) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    

    this.newsData$ = this.newsService.getState();
    if (this.newsService.getValue().length === 0) {
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
    this.flightService.getFlights({ limit: this.flightService.defaultLimit, clearStore: true })
      .pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
      // @hack for hide export item
      setTimeout(async () => {
        await loading.dismiss();
      }, 1);
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
    promiseList.push(this.flightService.getFlights({ store: false }).pipe(takeUntil(this.unsubscribe$)).toPromise());
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
            directory: Directory.Documents,
            recursive: true
          });
          await loading.dismiss();
          if (Capacitor.getPlatform() == "android") {
            const alert = await this.alertController.create({
              header: this.translate.instant('message.infotitle'),
              message: this.translate.instant('message.downloadExcel'),
              buttons: [this.translate.instant('buttons.done')]
            });
            await alert.present();
          } else {
            await FileOpener.open({
              filePath: result.uri,
              contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
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
