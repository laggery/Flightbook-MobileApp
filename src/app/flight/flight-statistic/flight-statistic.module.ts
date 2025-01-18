import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightStatisticPageRoutingModule } from './flight-statistic-routing.module';

import { FlightStatisticPage } from './flight-statistic.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from 'src/app/form/form.module';
import { ChartsModule } from 'src/app/charts/charts.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FlightStatisticPageRoutingModule,
        TranslateModule.forChild(),
        FormModule,
        ChartsModule,
        SharedModule,
        FlightStatisticPage
    ]
})
export class FlightStatisticPageModule { }
