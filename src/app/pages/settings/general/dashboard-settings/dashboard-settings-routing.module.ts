import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewDashboardSettingsComponent } from './view-dashboard-settings/view-dashboard-settings.component';
import { WebDashboardComponent } from './web-dashboard/web-dashboard.component';
import { AppDashboardComponent } from './app-dashboard/app-dashboard.component';

const routes: Routes = [
  { path: '', component: ViewDashboardSettingsComponent },
  { path: 'web', component: WebDashboardComponent },
  { path: 'mobile', component: AppDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardSettingsRoutingModule { }
