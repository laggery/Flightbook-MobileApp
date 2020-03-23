import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GliderListPage } from './glider-list.page';

const routes: Routes = [
  {
    path: '',
    component: GliderListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GliderListPageRoutingModule {}
