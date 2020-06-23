import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavController, IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { PlaceService } from '../place.service';
import { Place } from '../place';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.page.html',
  styleUrls: ['./place-list.page.scss'],
})
export class PlaceListPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  unsubscribe$ = new Subject<void>();
  places$: Observable<Place[]>;
  limit = 50;

  constructor(
    public navCtrl: NavController,
    private placeService: PlaceService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController
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
      await loading.dismiss();
    });
  }

  ngOnInit() {
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
}
