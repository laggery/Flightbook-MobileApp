import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaceAddPage } from './place-add.page';

const routes: Routes = [
  {
    path: '',
    component: PlaceAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceAddPageRoutingModule {}
