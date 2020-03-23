import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightListPage } from './flight-list.page';

const routes: Routes = [
  {
    path: '',
    component: FlightListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightListPageRoutingModule {}
