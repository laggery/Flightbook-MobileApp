import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergencyContactPageRoutingModule } from './emergency-contact-routing.module';

import { EmergencyContactPage } from './emergency-contact.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmergencyContactPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    EmergencyContactPage
  ]
})
export class EmergencyContactPageModule {}
