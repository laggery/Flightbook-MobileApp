import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightListPageRoutingModule } from './flight-list-routing.module';

import { FlightListPage } from './flight-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from 'src/app/form/form.module';
import { FlightFilterComponent } from 'src/app/form/flight-filter/flight-filter.component';
import { ExportModule } from 'flightbook-commons-library';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightListPageRoutingModule,
    TranslateModule.forChild(),
    ExportModule,
    FormModule
  ],
  declarations: [FlightListPage],
  entryComponents: [FlightFilterComponent]
})
export class FlightListPageModule {}
