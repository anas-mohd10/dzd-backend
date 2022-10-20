import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLimitsRoutingModule } from './page-limits-routing.module';
import { AddPageLimitsComponent } from './add-page-limits/add-page-limits.component';
import { PageLimitsComponent } from './page-limits/page-limits.component';
import { UpdatePageLimitsComponent } from './update-page-limits/update-page-limits.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AddPageLimitsComponent,
    PageLimitsComponent,
    UpdatePageLimitsComponent
  ],
  imports: [
    CommonModule,
    PageLimitsRoutingModule,
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
export class PageLimitsModule { }
