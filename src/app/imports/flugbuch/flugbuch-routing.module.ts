import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlugbuchPage } from './flugbuch.page';

const routes: Routes = [
  {
    path: '',
    component: FlugbuchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlugbuchPageRoutingModule {}
