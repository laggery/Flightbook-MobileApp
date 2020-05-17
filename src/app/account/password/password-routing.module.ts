import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordPage } from './password.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordPageRoutingModule {}
