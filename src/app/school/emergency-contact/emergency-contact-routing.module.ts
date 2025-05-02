import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyContactPage } from './emergency-contact.page';

const routes: Routes = [
  {
    path: '',
    component: EmergencyContactPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmergencyContactPageRoutingModule {}
