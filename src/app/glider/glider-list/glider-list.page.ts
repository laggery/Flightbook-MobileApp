import { Component, OnInit, OnDestroy } from '@angular/core';
import { Glider } from 'src/app/glider/glider';
import { NavController } from '@ionic/angular';
import { GliderService } from '../glider.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-glider-list',
  templateUrl: './glider-list.page.html',
  styleUrls: ['./glider-list.page.scss'],
})
export class GliderListPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  gliders$: Observable<Glider[]>;
  limit = 50;

  constructor(
    public navCtrl: NavController,
    private gliderService: GliderService
  ) {
    this.gliders$ = this.gliderService.getState();

    if (this.gliderService.getValue().length === 0) {
      this.gliderService.getGliders({ limit: this.limit }).pipe(takeUntil(this.unsubscribe$)).subscribe((res: Glider[]) => {
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
    this.gliderService.getGliders({ limit: this.limit, offset: this.gliderService.getValue().length })
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: Glider[]) => {
      event.target.complete();
      if (res.length < this.limit) {
        event.target.disabled = true;
        this.gliderService.isGliderlistComplete = true;
      }
    });
  }
}
