import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceAddPageRoutingModule } from './place-add-routing.module';

import { PlaceAddPage } from './place-add.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../form/form.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PlaceAddPageRoutingModule,
        TranslateModule.forChild(),
        FormModule,
        PlaceAddPage
    ]
})
export class PlaceAddPageModule { }
