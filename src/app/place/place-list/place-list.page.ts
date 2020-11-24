import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NavController, IonInfiniteScroll, LoadingController, IonContent } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Place, PlaceService, XlsxExportService } from 'flightbook-commons-library';

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

  constructor(
    public navCtrl: NavController,
    private placeService: PlaceService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private xlsxExportService: XlsxExportService
  ) {
    this.places$ = this.placeService.getState();

    if (this.placeService.getValue().length === 0) {
      this.initialDataLoad();
    }
  }

  private async initialDataLoad() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();
    this.placeService.getPlaces({ limit: this.limit }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Place[]) => {
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

  xlsxExport() {
    this.placeService.getPlaces({ store: false }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Place[]) => {
      this.xlsxExportService.exportPlaces("places", res);
    });
  }
}
