import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalController, LoadingController, IonInfiniteScroll } from '@ionic/angular';
import { GliderService } from '../glider.service';
import { GliderFilter } from '../glider-filter';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Glider } from '../glider';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-glider-filter',
  templateUrl: './glider-filter.component.html',
  styleUrls: ['./glider-filter.component.scss'],
})
export class GliderFilterComponent implements OnInit, OnDestroy {
  @Input() infiniteScroll: IonInfiniteScroll;
  private unsubscribe$ = new Subject<void>();
  public filter: GliderFilter;

  constructor(
    private modalCtrl: ModalController,
    private gliderService: GliderService,
    private loadingCtrl: LoadingController,
    private translate: TranslateService
  ) {
    this.filter = this.gliderService.filter;
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeFilter() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async filterElement() {
    this.infiniteScroll.disabled = false;
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.loading')
    });
    await loading.present();

    this.gliderService.filter = this.filter;
    this.gliderService.getGliders({ limit: this.gliderService.defaultLimit, clearStore: true }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Glider[]) => {
      await loading.dismiss();
      this.modalCtrl.dismiss({
        'dismissed': true
      });
    });
  }


  clearFilter() {
    this.infiniteScroll.disabled = false;
    this.filter = new GliderFilter();
    this.gliderService.filter = this.filter;
    this.gliderService.getGliders({ limit: this.gliderService.defaultLimit, clearStore: true }).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Glider[]) => {
      // TODO if necessary add loading
    });
  }
}
