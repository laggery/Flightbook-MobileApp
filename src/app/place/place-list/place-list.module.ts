import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceListPageRoutingModule } from './place-list-routing.module';

import { PlaceListPage } from './place-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { FlagsModule } from 'nxt-flags';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PlaceListPageRoutingModule,
        TranslateModule.forChild(),
        FlagsModule,
        PlaceListPage
    ],
    providers: []
})
export class PlaceListPageModule { }
