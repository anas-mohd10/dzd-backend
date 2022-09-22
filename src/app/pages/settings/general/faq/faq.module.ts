import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqListComponent } from './faq-list/faq-list.component';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { UpdateFaqComponent } from './update-faq/update-faq.component';
import { DataTablesModule } from 'angular-datatables';
import { WidgetsModule } from 'src/app/shared/partials';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    FaqListComponent,
    AddFaqComponent,
    UpdateFaqComponent
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    DataTablesModule,
    FormsModule,
    WidgetsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class FaqModule { }
