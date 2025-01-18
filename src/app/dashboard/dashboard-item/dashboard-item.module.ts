import { NgModule } from '@angular/core';
import { DashboardItemComponent } from './dashboard-item.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    exports: [
        DashboardItemComponent
    ],
    imports: [
        IonicModule,
        TranslateModule,
        CommonModule,
        RouterModule,
        DashboardItemComponent
    ]
})
export class DashboardItemModule {

}


