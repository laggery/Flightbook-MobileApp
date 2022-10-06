import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentListPage } from './appointment-list.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentListPageRoutingModule {}
