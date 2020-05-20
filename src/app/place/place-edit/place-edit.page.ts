import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../place';
import { PlaceService } from '../place.service';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-place-edit',
  templateUrl: './place-edit.page.html',
  styleUrls: ['./place-edit.page.scss'],
})
export class PlaceEditPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private placeId: number;
  place: Place;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {
    this.placeId = +this.activeRoute.snapshot.paramMap.get('id');
    this.place = this.placeService.getValue().find(place => place.id === this.placeId);
    this.place = _.cloneDeep(this.place);
    if (!this.place) {
      this.router.navigate(['/places'], { replaceUrl: true });
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async savePlace(place: Place) {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.saveplace')
    });
    await loading.present();

    this.placeService.putPlace(place).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Place) => {
      await loading.dismiss();
      this.router.navigate(['/places'], { replaceUrl: true });
    },
      (async (error: any) => {
        await loading.dismiss();
        if (error.status === 409) {
          const alert = await this.alertController.create({
            header: this.translate.instant('place.place'),
            message: this.translate.instant('message.placeExist'),
            buttons: [this.translate.instant('buttons.done')]
          });
          await alert.present();
        }
      })
    );
  }
}
