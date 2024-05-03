import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NavController, IonInfiniteScroll, LoadingController, IonContent, AlertController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Place } from 'src/app/place/shared/place.model';
import { XlsxExportService } from 'src/app/shared/services/xlsx-export.service';
import { PlaceService } from '../shared/place.service';
import { Countries, Country } from 'src/app/place/shared/place.countries';
import { json2csv } from 'json-2-csv';
import * as fileSaver from 'file-saver';
import { MapUtil } from 'src/app/shared/util/MapUtil';

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

  async csvExport() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.placeService.getPlaces({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Place[]) => {
      res.forEach((val: Place) => {
        delete val['id'];
        val.coordinates = MapUtil.convertEPSG3857ToEPSG4326(val.coordinates)?.flatCoordinates;
      })
      
      if (Capacitor.isNativePlatform()) {
        try {
          const data: any = json2csv(res, {emptyFieldValue: '', sortHeader: true});
          const path = `csv/places_export.csv`;

          await loading.dismiss();
          
          const result = await Filesystem.writeFile({
            path,
            data,
            directory: Directory.External,
            recursive: true,
            encoding: Encoding.UTF8
          });

          await FileOpener.open({
            filePath: result.uri,
            contentType: 'text/plain',
            openWithDefault: true
          });

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
        const data: any = json2csv(res, {emptyFieldValue: '', sortHeader: true});
        await loading.dismiss();
        var blob = new Blob([data], {
          type: "text/csv;charset=utf-8"
        });
        fileSaver.saveAs(blob, `places_export_${Date.now()}.csv`);
      }
    }, async (error: any) => {
      await loading.dismiss();
    });
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
        const data: any = await this.xlsxExportService.generatePlacesXlsxFile(res, { bookType: 'xlsx', type: 'array' });
        await loading.dismiss();
        this.xlsxExportService.saveExcelFile(data, `places`);
      }
    }, async (error: any) => {
      await loading.dismiss();
    });
  }
}
