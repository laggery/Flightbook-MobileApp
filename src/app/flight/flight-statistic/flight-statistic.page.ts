import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, firstValueFrom } from 'rxjs';
import { ModalController, LoadingController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonCard, IonCardContent, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FlightFilterComponent } from '../../form/flight-filter/flight-filter.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FlightStatistic } from '../shared/flightStatistic.model';
import { FlightService } from '../shared/flight.service';
import { Chart, ChartData } from 'chart.js';

import zoomPlugin from "chartjs-plugin-zoom";
import { NgIf, DecimalPipe } from '@angular/common';
import { BarChartComponent } from '../../charts/bar-chart/bar-chart.component';
import { LineChartComponent } from '../../charts/line-chart/line-chart.component';
import { HoursFormatPipe } from '../../shared/pipes/hours-format.pipe';
import { addIcons } from "ionicons";
import { filterOutline } from "ionicons/icons";

Chart.register(zoomPlugin);

@Component({
    selector: 'app-flight-statistic',
    templateUrl: './flight-statistic.page.html',
    styleUrls: ['./flight-statistic.page.scss'],
    imports: [
        NgIf,
        BarChartComponent,
        LineChartComponent,
        DecimalPipe,
        TranslateModule,
        HoursFormatPipe,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonButton,
        IonIcon,
        IonContent,
        IonCard,
        IonCardContent,
        IonSelect,
        IonSelectOption
    ]
})
export class FlightStatisticPage implements OnInit, OnDestroy {
    unsubscribe$ = new Subject<void>();
    statistics: FlightStatistic;
    statisticsList: FlightStatistic[];
    filtered: boolean;
    graphType: string;

    nbFlightBarChartData: ChartData<'bar'> = {
        labels: [],
        datasets: [
            { data: [] }
        ]
    };

    incomeBarChartData: ChartData<'bar'> = {
        labels: [],
        datasets: [
            { data: [] }
        ]
    };

    averageLineChartData: ChartData<'line'> = {
        labels: [],
        datasets: [
            { data: [] }
        ]
    };

    constructor(
        private flightService: FlightService,
        private modalCtrl: ModalController,
        private translate: TranslateService,
        private loadingCtrl: LoadingController
    ) {
        this.graphType = 'yearly';
        this.filtered = this.flightService.filtered$.getValue();
        this.flightService.filtered$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: boolean) => {
            this.filtered = value;
        });

        this.statistics = new FlightStatistic();
        this.statisticsList = [];
        addIcons({ filterOutline });
    }

    private async dataLoad() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });

        try {
            const promiseList = [];
            promiseList.push(firstValueFrom(this.flightService.getStatistics('global')));
            promiseList.push(firstValueFrom(this.flightService.getStatistics(this.graphType)));
            const data = await Promise.all(promiseList);
            this.statistics = (data[0] as FlightStatistic[])[0];
            this.statisticsList = data[1] as FlightStatistic[];
            this.prepareData();
        } catch (exception: any) {
            await loading.dismiss();
        }
    }

    private async graphDataLoad() {
        const loading = await this.loadingCtrl.create({
            message: this.translate.instant('loading.loading')
        });

        try {
            const data = await firstValueFrom(this.flightService.getStatistics(this.graphType));
            this.statisticsList = data;
            this.prepareData();
        } catch (exception: any) {
            await loading.dismiss();
        }
    }

    prepareData() {
        // Nb flight data
        const data: any = [];
        const labels: any = [];
        this.statisticsList.forEach((element: FlightStatistic) => {
            labels.push(element.type == 'monthly' ? `${element.month} ${element.year}` : element.year)
            data.push(element.nbFlights);
        });

        this.nbFlightBarChartData = {
            labels: labels,
            datasets: [
                { data: data, label: this.translate.instant('statistics.nbflight'), borderColor: "rgb(0, 84, 233)", borderWidth: 3, borderSkipped: true, hoverBackgroundColor: "rgb(0, 84, 233)", barPercentage: 1, categoryPercentage: 0.95 }
            ]
        };

        // Income data
        const incomeData: any = [];
        const incomeLabels: any = [];
        this.statisticsList.forEach((element: FlightStatistic) => {
            incomeLabels.push(element.type == 'monthly' ? `${element.month} ${element.year}` : element.year)
            incomeData.push(element.income);
        });

        this.incomeBarChartData = {
            labels: incomeLabels,
            datasets: [
                { data: incomeData, label: this.translate.instant('statistics.price'), borderColor: "rgb(0, 84, 233)", borderWidth: 3, borderSkipped: true, hoverBackgroundColor: "rgb(0, 84, 233)", barPercentage: 1, categoryPercentage: 0.95 }
            ]
        };

        // Average time
        const timeData: any = [];
        const averageData: any = [];
        const lineLabels: any = [];
        this.statisticsList.forEach((element: FlightStatistic) => {
            lineLabels.push(element.type == 'monthly' ? `${element.month} ${element.year}` : element.year)
            timeData.push(element.time);
            averageData.push(element.average);
        });

        this.averageLineChartData = {
            labels: lineLabels,
            datasets: [
                { data: timeData, label: this.translate.instant('statistics.flighthour'), borderColor: "rgb(0, 84, 233)", pointBackgroundColor: "rgb(0, 84, 233)", pointHoverBorderColor: "rgb(0, 84, 233)" },
                { yAxisID: 'y1', data: averageData, label: this.translate.instant('statistics.average'), borderColor: "rgb(143,187,255)", pointBackgroundColor: "rgb(143,187,255)", pointHoverBorderColor: "rgb(143,187,255)" }
            ]
        };
    }

    ngOnInit() {
        this.dataLoad();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    async openFilter() {
        const modal = await this.modalCtrl.create({
            component: FlightFilterComponent,
            cssClass: 'flight-filter-class',
            componentProps: {
                type: 'FlightStatisticPage',
                graphType: this.graphType
            }
        });

        this.modalOnDidDismiss(modal);
        return await modal.present();
    }

    async modalOnDidDismiss(modal: HTMLIonModalElement) {
        modal.onDidDismiss().then((resp: any) => {
            this.statisticsList.splice(0, this.statisticsList.length);
            this.statisticsList = resp.data.graphData;
            this.statistics = resp.data.statistics;
            this.prepareData();
        });
    }

    async changeGraphType(event: CustomEvent) {
        this.graphType = event.detail.value;
        this.graphDataLoad();
    }
}
