import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GliderListPageRoutingModule } from './glider-list-routing.module';

import { GliderListPage } from './glider-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { GliderFilterComponent } from '../glider-filter/glider-filter.component';
import { ApplicationPipesModule, ExportModule } from 'flightbook-commons-library';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GliderListPageRoutingModule,
    TranslateModule.forChild(),
    ApplicationPipesModule,
    ExportModule
  ],
  providers: [
    FileOpener
  ],
  declarations: [GliderListPage, GliderFilterComponent],
  entryComponents: [GliderFilterComponent],
})
export class GliderListPageModule { }
