import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataPageRoutingModule } from './data-routing.module';

import { DataPage } from './data.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataPageRoutingModule,
        TranslateModule.forChild(),
        DataPage
    ]
})
export class DataPageModule { }
