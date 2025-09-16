import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr'; // Or HotToastModule if that's what you're using project-wide

import { ErpSettingsRoutingModule } from './erp-settings-routing.module';
import { ErpSettingsListComponent } from './erp-settings-list/erp-settings-list.component';
import { ErpSettingsService } from 'src/app/includes/services/erp-settings.service';
import { SharedModule } from '../../../shared/shared.module'; // Import SharedModule

@NgModule({
  declarations: [
    ErpSettingsListComponent
  ],
  imports: [
    CommonModule,
    ErpSettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({ // Configure as per your project's existing setup for toast notifications
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    // HotToastModule.forRoot() // If using HotToast
    SharedModule // Import SharedModule here
  ],
  providers: [ErpSettingsService]
})
export class ErpSettingsModule { }
