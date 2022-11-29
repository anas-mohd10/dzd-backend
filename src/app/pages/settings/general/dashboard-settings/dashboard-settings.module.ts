import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardSettingsRoutingModule } from './dashboard-settings-routing.module';
import { ViewDashboardSettingsComponent } from './view-dashboard-settings/view-dashboard-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AddDashboardSettingsComponent } from './add-dashboard-settings/add-dashboard-settings.component';
import { UpdateDashboardSettingsComponent } from './update-dashboard-settings/update-dashboard-settings.component';


@NgModule({
  declarations: [
    ViewDashboardSettingsComponent,
    AddDashboardSettingsComponent,
    UpdateDashboardSettingsComponent
  ],
  imports: [
    CommonModule,
    DashboardSettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class DashboardSettingsModule { }
