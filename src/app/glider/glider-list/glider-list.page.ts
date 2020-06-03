import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Glider } from 'src/app/glider/glider';
import { NavController, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { GliderService } from '../glider.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GliderFilterComponent } from '../glider-filter/glider-filter.component'

@Component({
  selector: 'app-glider-list',
  templateUrl: './glider-list.page.html',
  styleUrls: ['./glider-list.page.scss'],
})
export class GliderListPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  unsubscribe$ = new Subject<void>();
  gliders$: Observable<Glider[]>;

  constructor(
    public navCtrl: NavController,
    private gliderService: GliderService,
    public modalCtrl: ModalController
  ) {
    this.gliders$ = this.gliderService.getState();

    if (this.gliderService.getValue().length === 0) {
      this.gliderService.getGliders({ limit: this.gliderService.defaultLimit }).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Glider[]) => {
        // TODO hide loading page
      });
    }
  }

  ngOnInit() {
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
    return await modal.present();
  }
}
