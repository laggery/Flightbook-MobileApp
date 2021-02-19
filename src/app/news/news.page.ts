import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  Flight,
  FlightService,
  GliderService,
  News,
  NewsService,
  PlaceService,
  XlsxExportService
} from 'flightbook-commons-library';
import { Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  newsData$: Observable<News[]>;
  amountOfFlights$: Observable<Flight[]>;

  constructor(
    private menuCtrl: MenuController,
    private alertController: AlertController,
    private translate: TranslateService,
    private newsService: NewsService,
    private gliderService: GliderService,
    private placeService: PlaceService,
    private flightService: FlightService,
    private loadingCtrl: LoadingController,
    private xlsxExportService: XlsxExportService,
    private fileOpener: FileOpener
  ) {
    this.menuCtrl.enable(true);

    this.newsData$ = this.newsService.getState();

    if (this.newsService.getValue().length === 0) {
      this.initialDataLoad();
    }
  }

  private async initialDataLoad() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.newsService.getNews(this.translate.currentLang).pipe(takeUntil(this.unsubscribe$)).subscribe(async (resp: News[]) => {
      await loading.dismiss();
    }, async (error: any) => {
      await loading.dismiss();
    });
  }

  ngOnInit() {
    //TODO: Initial load
    this.amountOfFlights$ = this.flightService.getState();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async xlsxExport() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    loading.present();
    let promiseList: Promise<any>[] = []
    promiseList.push(this.flightService.getFlights({ store: false }).pipe(takeUntil(this.unsubscribe$)).toPromise());
    promiseList.push(this.gliderService.getGliders({ store: false }).pipe(takeUntil(this.unsubscribe$)).toPromise());
    promiseList.push(this.placeService.getPlaces({ store: false }).pipe(takeUntil(this.unsubscribe$)).toPromise());

    Promise.all(promiseList).then(async (res: any) => {
      if (Capacitor.isNative) {
        try {
          let data: any = this.xlsxExportService.generateFlightbookXlsxFile(res[0], res[1], res[2], { bookType: 'xlsx', type: "base64" });
          let path = `xlsx/flightbook_export_${Date.now()}.xlsx`;

          const result = await Filesystem.writeFile({
            path,
            data,
            directory: FilesystemDirectory.Documents,
            recursive: true
          });
          loading.dismiss();
          this.fileOpener.open(`${result.uri}`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        } catch (e) {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: this.translate.instant('message.infotitle'),
            message: this.translate.instant('message.generationError'),
            buttons: [this.translate.instant('buttons.done')]
          });
          await alert.present();
        }
      } else {
        let data: any = this.xlsxExportService.generateFlightbookXlsxFile(res[0], res[1], res[2], { bookType: 'xlsx', type: "array" });
        loading.dismiss();
        this.xlsxExportService.saveExcelFile(data, `flightbook_export_${Date.now()}.xlsx`);
      }
    }, async (error: any) => {
      await loading.dismiss();
    });
  }
}
