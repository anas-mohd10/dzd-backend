import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDashboardSettingsComponent } from './add-dashboard-settings/add-dashboard-settings.component';
import { UpdateDashboardSettingsComponent } from './update-dashboard-settings/update-dashboard-settings.component';
import { ViewDashboardSettingsComponent } from './view-dashboard-settings/view-dashboard-settings.component';

const routes: Routes = [
  { path: '', component: ViewDashboardSettingsComponent },
  { path: 'add', component: AddDashboardSettingsComponent },
  { path: 'update', component: UpdateDashboardSettingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardSettingsRoutingModule { }
