import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GliderAddPageRoutingModule } from './glider-add-routing.module';

import { GliderAddPage } from './glider-add.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../form/form.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GliderAddPageRoutingModule,
        TranslateModule.forChild(),
        FormModule,
        GliderAddPage
    ]
})
export class GliderAddPageModule {}
