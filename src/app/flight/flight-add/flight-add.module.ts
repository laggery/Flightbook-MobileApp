import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightAddPageRoutingModule } from './flight-add-routing.module';

import { FlightAddPage } from './flight-add.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../form/form.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  IgcModule
} from 'flightbook-commons-library';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightAddPageRoutingModule,
    TranslateModule.forChild(),
    FormModule,
    SharedModule,
    IgcModule.forRoot(environment)
  ],
  declarations: [FlightAddPage]
})
export class FlightAddPageModule {}
