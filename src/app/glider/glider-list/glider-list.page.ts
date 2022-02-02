import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import {
  NavController,
  ModalController,
  IonInfiniteScroll,
  IonContent,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GliderFilterComponent } from '../glider-filter/glider-filter.component';
import { TranslateService } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Glider } from 'src/app/core/domain/glider';
import { GliderService } from 'src/app/core/services/glider.service';
import { XlsxExportService } from 'src/app/core/services/xlsx-export.service';

@Component({
  selector: 'app-glider-list',
  templateUrl: './glider-list.page.html',
  styleUrls: ['./glider-list.page.scss'],
})
export class GliderListPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  unsubscribe$ = new Subject<void>();
  gliders$: Observable<Glider[]>;
  filtered: boolean;

  constructor(
    public navCtrl: NavController,
    private gliderService: GliderService,
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private xlsxExportService: XlsxExportService,
    private fileOpener: FileOpener
  ) {
    this.gliders$ = this.gliderService.getState();
    this.filtered = this.gliderService.filtered$.getValue();
    this.gliderService.filtered$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: boolean) => {
      this.filtered = value;
    });

    this.initialDataLoad();
  }

  private async initialDataLoad() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.gliderService.getGliders({ limit: this.gliderService.defaultLimit, clearStore: true })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (res: Glider[]) => {
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

  itemTapped(event: MouseEvent, glider: Glider) {
    this.navCtrl.navigateForward(`gliders/${glider.id}`);
  }

  loadData(event: any) {
    this.gliderService.getGliders({
      limit: this.gliderService.defaultLimit,
      offset: this.gliderService.getValue().length
    })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: Glider[]) => {
        event.target.complete();
        if (res.length < this.gliderService.defaultLimit) {
          event.target.disabled = true;
          this.gliderService.isGliderlistComplete = true;
        }
      });
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: GliderFilterComponent,
      cssClass: 'glider-filter-class',
      componentProps: {
        infiniteScroll: this.infiniteScroll
      }
    });

    await this.modalOnDidDismiss(modal);

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
    loading.present();
    this.gliderService.getGliders({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Glider[]) => {
      if (Capacitor.isNativePlatform()) {
        try {
          const data: any = await this.xlsxExportService.generateGlidersXlsxFile(res, { bookType: 'xlsx', type: 'base64' });
          const path = `xlsx/gliders_export_${Date.now()}.xlsx`;

          const result = await Filesystem.writeFile({
            path,
            data,
            directory: Directory.Documents,
            recursive: true
          });
          await loading.dismiss();
          await this.fileOpener.open(`${result.uri}`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
        const data: any = await this.xlsxExportService.generateGlidersXlsxFile(res, { bookType: 'xlsx', type: 'array' });
        await loading.dismiss();
        this.xlsxExportService.saveExcelFile(data, `gliders_export_${Date.now()}.xlsx`);
      }
    }, async (error: any) => {
      await loading.dismiss();
    });
  }
}
