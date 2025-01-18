import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultipleIgcPageRoutingModule } from './multiple-igc-routing.module';

import { MultipleIgcPage } from './multiple-igc.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MultipleIgcPageRoutingModule,
        TranslateModule.forChild(),
        SharedModule,
        MultipleIgcPage
    ]
})
export class MultipleIgcPageModule {}
