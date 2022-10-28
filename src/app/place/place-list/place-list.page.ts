import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NavController, IonInfiniteScroll, LoadingController, IonContent, AlertController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Place } from 'src/app/place/shared/place.model';
import { XlsxExportService } from 'src/app/shared/services/xlsx-export.service';
import { PlaceService } from '../shared/place.service';
import { Countries, Country } from 'src/app/place/shared/place.countries';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.page.html',
  styleUrls: ['./place-list.page.scss'],
})
export class PlaceListPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;

  unsubscribe$ = new Subject<void>();
  places$: Observable<Place[]>;
  limit = 50;
  lang : string;
  countries: Country[] = Countries;

  constructor(
    public navCtrl: NavController,
    private alertController: AlertController,
    private placeService: PlaceService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private xlsxExportService: XlsxExportService
  ) {
    this.places$ = this.placeService.getState();
    this.lang = this.translate.currentLang;
    this.initialDataLoad();
  }

  private async initialDataLoad() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.placeService.getPlaces({ limit: this.limit, clearStore: true })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (res: Place[]) => {
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

  itemTapped(event: MouseEvent, place: Place) {
    this.navCtrl.navigateForward(`places/${place.id}`);
  }

  loadData(event: any) {
    this.placeService.getPlaces({ limit: this.limit, offset: this.placeService.getValue().length })
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: Place[]) => {
      event.target.complete();
      if (res.length < this.limit) {
        event.target.disabled = true;
      }
    });
  }

  getCountryNameByCode(code: string) {
    return code ? this.countries.find(x => x.code === code).name[this.lang] : "";
  }

  async xlsxExport() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.placeService.getPlaces({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Place[]) => {
      if (Capacitor.isNativePlatform()) {
        try {
          const data: any = await this.xlsxExportService.generatePlacesXlsxFile(res, { bookType: 'xlsx', type: 'base64' });
          const path = `xlsx/places_export.xlsx`;

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
        const data: any = await this.xlsxExportService.generatePlacesXlsxFile(res, { bookType: 'xlsx', type: 'array' });
        await loading.dismiss();
        this.xlsxExportService.saveExcelFile(data, `places_export_${Date.now()}.xlsx`);
      }
    }, async (error: any) => {
      await loading.dismiss();
    });
  }
}
