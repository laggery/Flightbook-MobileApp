import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GliderListPageRoutingModule } from './glider-list-routing.module';

import { GliderListPage } from './glider-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { GliderFilterComponent } from '../glider-filter/glider-filter.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GliderListPageRoutingModule,
        TranslateModule.forChild(),
        SharedModule,
        GliderListPage, GliderFilterComponent
    ],
    providers: []
})
export class GliderListPageModule { }
