import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardSettingsRoutingModule } from './dashboard-settings-routing.module';
import { ViewDashboardSettingsComponent } from './view-dashboard-settings/view-dashboard-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatNativeDateModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WebDashboardComponent } from './web-dashboard/web-dashboard.component';
import { AppDashboardComponent } from './app-dashboard/app-dashboard.component';

@NgModule({
  declarations: [
    ViewDashboardSettingsComponent,
    WebDashboardComponent,
    AppDashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardSettingsRoutingModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ],
})
export class DashboardSettingsModule { }
