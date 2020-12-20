import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [BarChartComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  exports: [
    BarChartComponent
  ]
})
export class ChartsModule { }
