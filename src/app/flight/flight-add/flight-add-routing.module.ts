import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightAddPage } from './flight-add.page';

const routes: Routes = [
  {
    path: '',
    component: FlightAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightAddPageRoutingModule {}
