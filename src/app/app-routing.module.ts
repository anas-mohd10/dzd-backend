import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessDeniedComponent } from './modules/errors/access-denied/access-denied.component';
import { SupportEmailVerificationComponent } from './pages/support-email-verification/support-email-verification.component';

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
  { path: 'support-email/:token', component: SupportEmailVerificationComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: "designs", loadChildren: () => import("./pages/store-designs/store-designs.module").then(m => m.StoreDesignsModule) },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
