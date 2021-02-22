import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { last, map, take, takeLast, takeUntil } from 'rxjs/operators';
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
import { Router } from '@angular/router';

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
    private router: Router,
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

  ngOnInit() {
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

    async copyLastFlight() {
      this.flightService.getFlights({ limit: 1, store: false })
        .pipe(take(1))
        .pipe(takeUntil(this.unsubscribe$)).subscribe((res: Flight[]) => {
        if (res.length > 0) {
          this.router.navigate(['flights/add'], { state: {flight: res[0]} });
        }
      });

    }
}
