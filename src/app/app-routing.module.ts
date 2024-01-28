import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './account/shared/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'news',
    pathMatch: 'full'
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then(m => m.NewsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'flights',
    loadChildren: () => import('./flight/flight-list/flight-list.module').then(m => m.FlightListPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'flights/add',
    loadChildren: () => import('./flight/flight-add/flight-add.module').then(m => m.FlightAddPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'flights/statistic',
    loadChildren: () => import('./flight/flight-statistic/flight-statistic.module').then( m => m.FlightStatisticPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'flights/:id',
    loadChildren: () => import('./flight/flight-edit/flight-edit.module').then(m => m.FlightEditPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'gliders',
    loadChildren: () => import('./glider/glider-list/glider-list.module').then(m => m.GliderListPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'gliders/add',
    loadChildren: () => import('./glider/glider-add/glider-add.module').then(m => m.GliderAddPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'gliders/:id',
    loadChildren: () => import('./glider/glider-edit/glider-edit.module').then( m => m.GliderEditPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'places',
    loadChildren: () => import('./place/place-list/place-list.module').then(m => m.PlaceListPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'places/add',
    loadChildren: () => import('./place/place-add/place-add.module').then(m => m.PlaceAddPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'places/:id',
    loadChildren: () => import('./place/place-edit/place-edit.module').then(m => m.PlaceEditPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'imports/igc',
    loadChildren: () => import('./imports/multiple-igc/multiple-igc.module').then( m => m.MultipleIgcPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'imports/flugbuch',
    loadChildren: () => import('./imports/flugbuch/flugbuch.module').then( m => m.FlugbuchPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./account/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./account/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'flight-edit',
    loadChildren: () => import('./flight/flight-edit/flight-edit.module').then( m => m.FlightEditPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'settings',
    loadChildren: () => import('./account/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'password',
    loadChildren: () => import('./account/password/password.module').then( m => m.PasswordPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'school/:id',
    loadChildren: () => import('./school/appointment-list/appointment-list.module').then( m => m.AppointmentListPageModule)
  },
  {
    path: 'control-sheet',
    loadChildren: () => import('./school/control-sheet/control-sheet.module').then( m => m.ControlSheetPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
