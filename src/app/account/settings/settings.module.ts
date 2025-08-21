import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsPageRoutingModule } from './settings-routing.module';

import { AccountDataPage } from './account-data.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SettingsPageRoutingModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AccountDataPage
    ]
})
export class SettingsPageModule { }
