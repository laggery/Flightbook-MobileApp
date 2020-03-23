import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaceEditPage } from './place-edit.page';

const routes: Routes = [
  {
    path: '',
    component: PlaceEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceEditPageRoutingModule {}
