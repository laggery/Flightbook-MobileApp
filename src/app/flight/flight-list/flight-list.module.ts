import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightListPageRoutingModule } from './flight-list-routing.module';

import { FlightListPage } from './flight-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from 'src/app/form/form.module';
import { FlagsModule } from 'nxt-flags';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FlightListPageRoutingModule,
        TranslateModule.forChild(),
        FormModule,
        FlagsModule,
        FlightListPage
    ],
    providers: []
})
export class FlightListPageModule { }
