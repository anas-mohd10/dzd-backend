import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAppSettingsComponent } from './add-app-settings/add-app-settings.component';
import { UpdateAppSettingsComponent } from './update-app-settings/update-app-settings.component';
import { ViewAppSettingsComponent } from './view-app-settings/view-app-settings.component';

const routes: Routes = [
  { path: '', component: ViewAppSettingsComponent },
  { path: 'add', component: AddAppSettingsComponent },
  { path: 'update', component: UpdateAppSettingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppSettingsRoutingModule { }
