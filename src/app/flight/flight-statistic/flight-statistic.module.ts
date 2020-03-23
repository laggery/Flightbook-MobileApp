import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightStatisticPageRoutingModule } from './flight-statistic-routing.module';

import { FlightStatisticPage } from './flight-statistic.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightStatisticPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [FlightStatisticPage]
})
export class FlightStatisticPageModule {}
