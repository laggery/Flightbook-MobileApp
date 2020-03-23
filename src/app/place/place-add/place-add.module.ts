import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceAddPageRoutingModule } from './place-add-routing.module';

import { PlaceAddPage } from './place-add.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../form/form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceAddPageRoutingModule,
    TranslateModule.forChild(),
    FormModule
  ],
  declarations: [PlaceAddPage]
})
export class PlaceAddPageModule {}
