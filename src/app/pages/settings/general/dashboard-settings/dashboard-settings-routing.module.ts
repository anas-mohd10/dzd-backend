import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDashboardSettingsComponent } from './add-dashboard-settings/add-dashboard-settings.component';
import { ViewDashboardSettingsComponent } from './view-dashboard-settings/view-dashboard-settings.component';

const routes: Routes = [
  { path: '', component: ViewDashboardSettingsComponent },
  { path: 'add', component: AddDashboardSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardSettingsRoutingModule { }
