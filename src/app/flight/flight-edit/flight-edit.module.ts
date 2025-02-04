import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightEditPageRoutingModule } from './flight-edit-routing.module';

import { FlightEditPage } from './flight-edit.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from 'src/app/form/form.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FlightEditPageRoutingModule,
        TranslateModule.forChild(),
        FormModule,
        SharedModule,
        FlightEditPage
    ]
})
export class FlightEditPageModule { }
