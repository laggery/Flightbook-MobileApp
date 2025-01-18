import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { LineChartComponent } from './line-chart/line-chart.component';
import { NgChartsModule } from 'ng2-charts';
import 'hammerjs';
import 'chartjs-plugin-zoom';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        NgChartsModule,
        BarChartComponent, LineChartComponent
    ],
    exports: [
        BarChartComponent,
        LineChartComponent
    ]
})
export class ChartsModule { }
