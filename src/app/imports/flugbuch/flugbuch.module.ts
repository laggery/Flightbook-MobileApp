import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlugbuchPageRoutingModule } from './flugbuch-routing.module';

import { FlugbuchPage } from './flugbuch.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlugbuchPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [FlugbuchPage]
})
export class FlugbuchPageModule {}
