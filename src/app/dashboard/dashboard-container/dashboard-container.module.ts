import { NgModule } from '@angular/core';
import { DashboardContainerComponent } from './dashboard-container.component';
import { DashboardItemModule } from '../dashboard-item/dashboard-item.module';

@NgModule({
    exports: [
        DashboardContainerComponent
    ],
    imports: [
        DashboardItemModule,
        DashboardContainerComponent
    ]
})
export class DashboardContainerModule {

}


