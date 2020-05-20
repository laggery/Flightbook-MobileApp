import { Component, OnInit, OnDestroy } from '@angular/core';
import { Glider } from 'src/app/glider/glider';
import { ActivatedRoute, Router } from '@angular/router';
import { GliderService } from '../glider.service';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-glider-edit',
  templateUrl: './glider-edit.page.html',
  styleUrls: ['./glider-edit.page.scss'],
})
export class GliderEditPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  private gliderId: number;
  glider: Glider;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private gliderService: GliderService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.gliderId = +this.activeRoute.snapshot.paramMap.get('id');
    this.glider = this.gliderService.getValue().find(glider => glider.id === this.gliderId);
    this.glider = _.cloneDeep(this.glider);
    if (!this.glider) {
      this.router.navigate(['/gliders'], { replaceUrl: true });
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async saveGlider(glider: Glider) {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.saveglider')
    });
    await loading.present();

    this.gliderService.putGlider(glider).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Glider) => {
      await loading.dismiss();
      this.router.navigate(['/gliders'], { replaceUrl: true });
    },
      (async (resp: any) => {
        await loading.dismiss();
        if (resp.status === 422) {
          const alert = await this.alertController.create({
            header: this.translate.instant('message.infotitle'),
            message: resp.error.message,
            buttons: [this.translate.instant('buttons.done')]
          });
          await alert.present();
        }
      })
    );
  }
}
