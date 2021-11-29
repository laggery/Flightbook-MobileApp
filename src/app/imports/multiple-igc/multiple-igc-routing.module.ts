import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultipleIgcPage } from './multiple-igc.page';

const routes: Routes = [
  {
    path: '',
    component: MultipleIgcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultipleIgcPageRoutingModule {}
