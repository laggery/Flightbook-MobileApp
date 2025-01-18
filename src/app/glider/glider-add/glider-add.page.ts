import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingController, AlertController, IonicModule } from '@ionic/angular';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { Glider } from '../shared/glider.model';
import { GliderService } from '../shared/glider.service';
import * as moment from 'moment';
import { GliderFormComponent } from '../../form/glider-form/glider-form';

@Component({
    selector: 'app-glider-add',
    templateUrl: './glider-add.page.html',
    styleUrls: ['./glider-add.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        GliderFormComponent,
        TranslateModule,
    ],
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

    if (glider.buyDate){
      glider.buyDate = moment(glider.buyDate).format('YYYY-MM-DD');
    }

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
