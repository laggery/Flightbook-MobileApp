import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GliderListPageRoutingModule } from './glider-list-routing.module';

import { GliderListPage } from './glider-list.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GliderListPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [GliderListPage]
})
export class GliderListPageModule {}
