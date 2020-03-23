import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightStatisticPage } from './flight-statistic.page';

const routes: Routes = [
  {
    path: '',
    component: FlightStatisticPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightStatisticPageRoutingModule {}
