import { NgModule } from '@angular/core';
import { DashboardContainerComponent } from './dashboard-container.component';
import { DashboardItemModule } from '../dashboard-item/dashboard-item.module';

@NgModule({
  declarations: [
    DashboardContainerComponent
  ],
  exports: [
    DashboardContainerComponent
  ],
  imports: [
    DashboardItemModule
  ]
})
export class DashboardContainerModule {

}


