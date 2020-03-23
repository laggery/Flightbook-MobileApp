import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightAddPageRoutingModule } from './flight-add-routing.module';

import { FlightAddPage } from './flight-add.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../form/form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightAddPageRoutingModule,
    TranslateModule.forChild(),
    FormModule
  ],
  declarations: [FlightAddPage]
})
export class FlightAddPageModule {}
