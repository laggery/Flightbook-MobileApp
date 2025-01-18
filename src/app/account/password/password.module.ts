import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordPageRoutingModule } from './password-routing.module';

import { PasswordPage } from './password.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PasswordPageRoutingModule,
        TranslateModule.forChild(),
        PasswordPage
    ]
})
export class PasswordPageModule { }
