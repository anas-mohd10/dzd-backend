import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'brand',
    loadChildren: () =>
      import('./catalog/brand/brand-list/brand-list.module').then((m) => m.DashboardModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(Routing)],
  exports: [RouterModule],
})

export class RoutingModule {}
