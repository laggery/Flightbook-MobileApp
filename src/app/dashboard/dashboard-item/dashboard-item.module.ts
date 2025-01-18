import { NgModule } from '@angular/core';
import { DashboardItemComponent } from './dashboard-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    exports: [
        DashboardItemComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        RouterModule,
        DashboardItemComponent
    ]
})
export class DashboardItemModule {

}


