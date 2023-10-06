import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { LineChartComponent } from './line-chart/line-chart.component';
import { NgChartsModule } from 'ng2-charts';
import 'hammerjs';
import 'chartjs-plugin-zoom';

@NgModule({
  declarations: [BarChartComponent, LineChartComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NgChartsModule
  ],
  exports: [
    BarChartComponent,
    LineChartComponent
  ]
})
export class ChartsModule { }
