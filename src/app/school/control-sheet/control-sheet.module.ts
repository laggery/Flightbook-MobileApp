import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlSheetPageRoutingModule } from './control-sheet-routing.module';

import { ControlSheetPage } from './control-sheet.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControlSheetDetailsComponent } from '../shared/components/control-sheet-details/control-sheet-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlSheetPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: [ControlSheetPage, ControlSheetDetailsComponent]
})
export class ControlSheetPageModule {}
