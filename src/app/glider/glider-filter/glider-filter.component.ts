import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalController, LoadingController, IonInfiniteScroll, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GliderFilter } from 'src/app/glider/shared/glider-filter.model';
import { GliderService } from '../shared/glider.service';
import { Glider } from '../shared/glider.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-glider-filter',
    templateUrl: './glider-filter.component.html',
    styleUrls: ['./glider-filter.component.scss'],
    imports: [
        FormsModule,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonItem,
        IonInput,
        IonSelect,
        IonSelectOption,
        IonButton
    ]
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

    async filterElement() {
        this.gliderService.filter = this.filter;
        this.closeFilter();
    }

    clearFilter() {
        this.filter = new GliderFilter();
        this.gliderService.filter = this.filter;
        this.closeFilter();
    }

    private async closeFilter() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });
        await loading.present();

        this.infiniteScroll.disabled = false;

        this.gliderService.getGliders({ limit: this.gliderService.defaultLimit, clearStore: true })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(async (res: Glider[]) => {
                await loading.dismiss();
                this.modalCtrl.dismiss({
                    dismissed: true
                });
            }, async (error: any) => {
                await loading.dismiss();
            });
    }
}
