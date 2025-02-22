import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlSheetPageRoutingModule } from './control-sheet-routing.module';

import { ControlSheetPage } from './control-sheet.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControlSheetDetailsComponent } from '../shared/components/control-sheet-details/control-sheet-details.component';
import { NxgTransalteSortPipe } from 'src/app/shared/pipes/nxg-transalte-sort.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ControlSheetPageRoutingModule,
        TranslateModule.forChild(),
        SharedModule,
        ControlSheetPage, ControlSheetDetailsComponent
    ],
    providers: [
        NxgTransalteSortPipe
    ]
})
export class ControlSheetPageModule { }
