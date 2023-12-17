import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlSheetPage } from './control-sheet.page';

const routes: Routes = [
  {
    path: '',
    component: ControlSheetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlSheetPageRoutingModule {}
