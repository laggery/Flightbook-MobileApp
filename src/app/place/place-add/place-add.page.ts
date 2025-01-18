import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingController, AlertController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import HttpStatusCode from '../../shared/util/HttpStatusCode';
import { Place } from 'src/app/place/shared/place.model';
import { PlaceService } from '../shared/place.service';
import { PlaceFormComponent } from '../../form/place-form/place-form';

@Component({
    selector: 'app-place-add',
    templateUrl: './place-add.page.html',
    styleUrls: ['./place-add.page.scss'],
    standalone: true,
    imports: [
        PlaceFormComponent,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent
    ],
})
export class PlaceAddPage implements OnInit, OnDestroy {
    unsubscribe$ = new Subject<void>();
    place: Place;

    constructor(
        private router: Router,
        private translate: TranslateService,
        private placeService: PlaceService,
        private loadingCtrl: LoadingController,
        private alertController: AlertController
    ) {
        this.place = new Place();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    async savePlace(place: Place) {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.saveplace')
        });
        await loading.present();

        this.placeService.postPlace(place).pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Place) => {
            await loading.dismiss();
            await this.router.navigate(['/places'], { replaceUrl: true });
        },
            (async (error: any) => {
                await loading.dismiss();
                if (error.status === HttpStatusCode.CONFLICT) {
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
