import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from './core/auth/logged.in.guard';
import { LayoutModule } from './shared/layout';
LayoutModule

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () => import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    loadChildren: () => import('./shared/layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled', useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
