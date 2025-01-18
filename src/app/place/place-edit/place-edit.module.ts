import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceEditPageRoutingModule } from './place-edit-routing.module';

import { PlaceEditPage } from './place-edit.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../form/form.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PlaceEditPageRoutingModule,
        TranslateModule.forChild(),
        FormModule,
        PlaceEditPage
    ]
})
export class PlaceEditPageModule { }
