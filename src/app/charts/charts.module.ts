import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  declarations: [BarChartComponent, LineChartComponent, PieChartComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  exports: [
    BarChartComponent,
    LineChartComponent,
    PieChartComponent
  ]
})
export class ChartsModule { }
