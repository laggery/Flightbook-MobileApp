import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingController, AlertController, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { Glider } from '../shared/glider.model';
import { GliderService } from '../shared/glider.service';
import { FlightService } from 'src/app/flight/shared/flight.service';
import moment from 'moment';
import { GliderFormComponent } from '../../form/glider-form/glider-form';

@Component({
    selector: 'app-glider-edit',
    templateUrl: './glider-edit.page.html',
    styleUrls: ['./glider-edit.page.scss'],
    imports: [
        GliderFormComponent,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonButton
    ]
})
export class GliderEditPage implements OnInit, OnDestroy {
    unsubscribe$ = new Subject<void>();
    private gliderId: number;
    glider: Glider;
    deleteDisabled: boolean;

    constructor(
        private activeRoute: ActivatedRoute,
        private router: Router,
        private gliderService: GliderService,
        private flightService: FlightService,
        private loadingCtrl: LoadingController,
        private alertController: AlertController,
        private translate: TranslateService
    ) {
        this.deleteDisabled = true;
        this.gliderId = +this.activeRoute.snapshot.paramMap.get('id');
        this.glider = this.gliderService.getValue().find(glider => glider.id === this.gliderId);
        this.glider = _.cloneDeep(this.glider);
        if (!this.glider) {
            this.router.navigate(['/gliders'], { replaceUrl: true });
        }
        this.flightService.nbFlightsByGliderId(this.gliderId).subscribe((resp: any) => {
            if (resp.nbFlights == 0) {
                this.deleteDisabled = false;
            }
        });
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

        if (glider.buyDate) {
            glider.buyDate = moment(glider.buyDate).format('YYYY-MM-DD');
        }

        this.gliderService.putGlider(glider).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Glider) => {
            await loading.dismiss();
            this.router.navigate(['/gliders'], { replaceUrl: true });
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

    async delete() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.deleteglider')
        });
        await loading.present();

        this.gliderService.deleteGlider(this.glider).subscribe(async (res: any) => {
            await loading.dismiss();
            await this.router.navigate(['/gliders'], { replaceUrl: true });
        },
            (async (error: any) => {
                await loading.dismiss();
                if (error.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
                    const alert = await this.alertController.create({
                        header: this.translate.instant('groupname.glider'),
                        message: this.translate.instant('message.deleteError'),
                        buttons: [this.translate.instant('buttons.done')]
                    });
                    await alert.present();
                }
            })
        );
    }
}
