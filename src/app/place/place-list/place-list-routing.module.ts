import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaceListPage } from './place-list.page';

const routes: Routes = [
  {
    path: '',
    component: PlaceListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceListPageRoutingModule {}
