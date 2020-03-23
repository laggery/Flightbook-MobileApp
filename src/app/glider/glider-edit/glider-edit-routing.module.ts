import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GliderEditPage } from './glider-edit.page';

const routes: Routes = [
  {
    path: '',
    component: GliderEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GliderEditPageRoutingModule {}
