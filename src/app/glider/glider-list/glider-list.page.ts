import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, ModalController, IonInfiniteScroll, IonContent, LoadingController } from '@ionic/angular';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GliderFilterComponent } from '../glider-filter/glider-filter.component'
import { TranslateService } from '@ngx-translate/core';
import { Glider, GliderService, XlsxExportService } from 'flightbook-commons-library';

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
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private xlsxExportService: XlsxExportService
  ) {
    this.gliders$ = this.gliderService.getState();
    this.filtered = this.gliderService.filtered$.getValue();
    this.gliderService.filtered$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: boolean) => {
      this.filtered = value;
    })

    this.initialDataLoad();
  }

  private async initialDataLoad() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.gliderService.getGliders({ limit: this.gliderService.defaultLimit, clearStore: true }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Glider[]) => {
      // @hack for hide export item
      setTimeout(async () => {
        this.content.scrollToPoint(0, 48);
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
    this.gliderService.getGliders({ limit: this.gliderService.defaultLimit, offset: this.gliderService.getValue().length })
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
        'infiniteScroll': this.infiniteScroll
      }
    });

    this.modalOnDidDismiss(modal);
    
    return await modal.present();
  }

  async modalOnDidDismiss(modal: HTMLIonModalElement) {
    modal.onDidDismiss().then((resp: any) => {
      this.content.scrollToPoint(0, 48);
    })
  }

  xlsxExport() {
    this.gliderService.getGliders({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Glider[]) => {
      this.xlsxExportService.exportGliders("gliders", res);
    });
  }
}
