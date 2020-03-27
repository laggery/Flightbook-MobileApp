import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './account/auth-guard.service';

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
    path: 'flight',
    loadChildren: () => import('./flight/flight-list/flight-list.module').then(m => m.FlightListPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'flight/add',
    loadChildren: () => import('./flight/flight-add/flight-add.module').then(m => m.FlightAddPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'flight/statistic',
    loadChildren: () => import('./flight/flight-statistic/flight-statistic.module').then(m => m.FlightStatisticPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'glider',
    loadChildren: () => import('./glider/glider-list/glider-list.module').then(m => m.GliderListPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'glider/add',
    loadChildren: () => import('./glider/glider-add/glider-add.module').then(m => m.GliderAddPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'glider/:id',
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
    path: 'login',
    loadChildren: () => import('./account/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./account/register/register.module').then(m => m.RegisterPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
