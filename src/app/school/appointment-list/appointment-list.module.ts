import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentListPageRoutingModule } from './appointment-list-routing.module';

import { AppointmentListPage } from './appointment-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentListPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AppointmentListPage,
    AppointmentDetailsComponent
  ]
})
export class AppointmentListPageModule {}
