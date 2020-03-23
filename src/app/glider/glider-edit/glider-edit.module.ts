import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GliderEditPageRoutingModule } from './glider-edit-routing.module';

import { GliderEditPage } from './glider-edit.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../form/form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GliderEditPageRoutingModule,
    TranslateModule.forChild(),
    FormModule
  ],
  declarations: [GliderEditPage]
})
export class GliderEditPageModule {}
