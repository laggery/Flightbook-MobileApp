import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentListPageRoutingModule } from './appointment-list-routing.module';

import { AppointmentListPage } from './appointment-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentDetailsComponent } from '../shared/components/appointment-details/appointment-details.component';
import { AppointmentFilterComponent } from '../shared/components/appointment-filter/appointment-filter.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppointmentListPageRoutingModule,
        TranslateModule.forChild(),
        AppointmentListPage,
        AppointmentDetailsComponent,
        AppointmentFilterComponent
    ]
})
export class AppointmentListPageModule { }
