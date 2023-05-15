import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightListPageRoutingModule } from './flight-list-routing.module';

import { FlightListPage } from './flight-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from 'src/app/form/form.module';
import { FlagsModule } from 'nxt-flags';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FlightListPageRoutingModule,
        TranslateModule.forChild(),
        FormModule,
        FlagsModule
    ],
    providers: [],
    declarations: [FlightListPage]
})
export class FlightListPageModule {}
