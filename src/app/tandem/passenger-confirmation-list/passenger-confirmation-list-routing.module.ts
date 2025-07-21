import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassengerConfirmationListPage } from './passenger-confirmation-list.page';

const routes: Routes = [
  {
    path: '',
    component: PassengerConfirmationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasengerConfirmationListPageRoutingModule {}
