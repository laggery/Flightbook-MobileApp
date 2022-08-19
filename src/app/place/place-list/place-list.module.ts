import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceListPageRoutingModule } from './place-list-routing.module';

import { PlaceListPage } from './place-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FlagsModule } from 'nxt-flags';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceListPageRoutingModule,
    TranslateModule.forChild(),
    FlagsModule
  ],
  providers: [
    FileOpener
  ],
  declarations: [PlaceListPage]
})
export class PlaceListPageModule {}
