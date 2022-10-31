import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSettingsRoutingModule } from './app-settings-routing.module';
import { ViewAppSettingsComponent } from './view-app-settings/view-app-settings.component';
import { AddAppSettingsComponent } from './add-app-settings/add-app-settings.component';
import { UpdateAppSettingsComponent } from './update-app-settings/update-app-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    ViewAppSettingsComponent,
    AddAppSettingsComponent,
    UpdateAppSettingsComponent
  ],
  imports: [
    CommonModule,
    AppSettingsRoutingModule,
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
export class AppSettingsModule { }
