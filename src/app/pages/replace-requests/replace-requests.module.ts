import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReplaceRequestsRoutingModule } from './replace-requests-routing.module';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { ManageRequestsComponent } from './manage-requests/manage-requests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    RequestsListComponent,
    ManageRequestsComponent
  ],
  imports: [
    CommonModule,
    ReplaceRequestsRoutingModule,
    FormsModule,
    BsDatepickerModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ReplaceRequestsModule { }
