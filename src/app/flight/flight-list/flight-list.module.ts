import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightListPageRoutingModule } from './flight-list-routing.module';

import { FlightListPage } from './flight-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { FlightFilterComponent } from '../flight-filter/flight-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightListPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [FlightListPage, FlightFilterComponent],
  entryComponents: [FlightFilterComponent]
})
export class FlightListPageModule {}
