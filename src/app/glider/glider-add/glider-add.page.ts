import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Glider, GliderService } from 'flightbook-commons-library';
import HttpStatusCode from '../../shared/util/HttpStatusCode';

@Component({
  selector: 'app-glider-add',
  templateUrl: './glider-add.page.html',
  styleUrls: ['./glider-add.page.scss'],
})
export class GliderAddPage implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  glider: Glider;

  constructor(
    private router: Router,
    private gliderService: GliderService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.glider = new Glider();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async saveGlider(glider: Glider) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('loading.saveglider')
    });
    await loading.present();

    this.gliderService.postGlider(glider).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Glider) => {
      await loading.dismiss();
      await this.router.navigate(['/gliders'], { replaceUrl: true });
    },
      (async (resp: any) => {
        await loading.dismiss();
        if (resp.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
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
