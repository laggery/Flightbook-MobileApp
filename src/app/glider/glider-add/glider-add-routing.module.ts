import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GliderAddPage } from './glider-add.page';

const routes: Routes = [
  {
    path: '',
    component: GliderAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GliderAddPageRoutingModule {}
