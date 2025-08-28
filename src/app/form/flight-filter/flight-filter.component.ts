import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IonInfiniteScroll, ModalController, LoadingController, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonSelect, IonSelectOption, IonInput, IonButton, IonModal, IonDatetime } from '@ionic/angular/standalone';
import { Subject, firstValueFrom } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { FlightFilter } from 'src/app/flight/shared/flight-filter.model';
import { Glider } from 'src/app/glider/shared/glider.model';
import { FlightStore } from 'src/app/flight/shared/flight.store';
import { GliderStore } from 'src/app/glider/shared/glider.store';
import { Flight } from 'src/app/flight/shared/flight.model';
import { FlightStatistic } from 'src/app/flight/shared/flightStatistic.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-flight-filter',
    templateUrl: './flight-filter.component.html',
    styleUrls: ['./flight-filter.component.scss'],
    imports: [
        FormsModule,
        DatePipe,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonItem,
        IonSelect,
        IonSelectOption,
        IonInput,
        IonButton,
        IonModal,
        IonDatetime
    ]
})
export class FlightFilterComponent implements OnInit, OnDestroy {
    @Input() infiniteScroll: IonInfiniteScroll;
    @Input() type: string;
    @Input() graphType: string;
    public gliders: Glider[];
    private unsubscribe$ = new Subject<void>();
    public filter: FlightFilter;
    public language;

    constructor(
        private modalCtrl: ModalController,
        private flightStore: FlightStore,
        private gliderStore: GliderStore,
        private loadingCtrl: LoadingController,
        private translate: TranslateService
    ) {
        this.filter = this.flightStore.filter();
        this.language = translate.currentLang;

        if (this.gliderStore.isGliderlistComplete) {
            this.gliders = this.gliderStore.gliders();
        } else {
            this.gliderStore.getGliders({ clearStore: true }).pipe(takeUntil(this.unsubscribe$)).subscribe((resp: Glider[]) => {
                this.gliderStore.isGliderlistComplete = true;
                this.gliders = this.gliderStore.gliders();
            });
        }
    }

    ngOnInit() { }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    async filterElement() {
        this.flightStore.updateFilter(this.filter);
        this.closeFilter();
    }

    clearFilter() {
        this.filter = new FlightFilter();
        this.flightStore.updateFilter(this.filter);
        this.closeFilter();
    }

    clearGLiderButton() {
        this.filter.glider = new Glider();
    }

    clearDateButton(type: string) {
        if (type === 'from') {
            this.filter.from = null;
        } else {
            this.filter.to = null;
        }
    }

    changeDate(type: string, event: CustomEvent) {
        if (type === 'from') {
            this.filter.from = event.detail.value ? event.detail.value : new Date();
        } else {
            this.filter.to = event.detail.value ? event.detail.value : new Date();
        }
    }

    private async closeFilter() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });
        await loading.present();

        if (this.type === 'FlightListPage') {
            this.closeFlightFilter(loading);
        } else {
            this.closeStatisticFilter(loading);
        }
    }

    private async closeFlightFilter(loading: HTMLIonLoadingElement) {
        this.infiniteScroll.disabled = false;
        this.flightStore.getFlights({ limit: this.flightStore.defaultLimit, clearStore: true })
            .pipe(takeUntil(this.unsubscribe$)).subscribe(async (res: Flight[]) => {
                await loading.dismiss();
                this.modalCtrl.dismiss({
                    dismissed: true
                });
            }, async (error: any) => {
                await loading.dismiss();
            });
    }

    private async closeStatisticFilter(loading: HTMLIonLoadingElement) {
        this.flightStore.clearFlights();
        try {
            const promiseList = [];
            promiseList.push(firstValueFrom(this.flightStore.getStatistics('global')));
            promiseList.push(firstValueFrom(this.flightStore.getStatistics(this.graphType)));
            const data = await Promise.all(promiseList);
            await loading.dismiss();
            this.modalCtrl.dismiss({
                dismissed: true,
                statistics: (data[0] as FlightStatistic[])[0],
                graphData: data[1] as FlightStatistic[]
            });
        } catch (exception: any) {
            await loading.dismiss();
        }
    }
}
