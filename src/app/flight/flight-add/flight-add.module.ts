import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightAddPageRoutingModule } from './flight-add-routing.module';

import { FlightAddPage } from './flight-add.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../form/form.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FlightAddPageRoutingModule,
        TranslateModule.forChild(),
        FormModule,
        SharedModule,
        FlightAddPage
    ]
})
export class FlightAddPageModule { }
