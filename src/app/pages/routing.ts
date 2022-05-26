import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/brand/brand-list/brand-list.module').then((m) => m.BrandModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/brand/manage-brand/manage-brand.module').then((m) => m.ManageBrandModule),
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
