import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { WidgetsModule } from '../../../shared/partials';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReturnsRoutingModule } from './returns-routing.module';
import { ReturnsListComponent } from './returns-list/returns-list.component';
import { UpdateReturnsListComponent } from './update-returns-list/update-returns-list.component';


@NgModule({
  declarations: [
    ReturnsListComponent,
    UpdateReturnsListComponent
  ],
  imports: [
    CommonModule,
    ReturnsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    WidgetsModule,
  ]
})
export class ReturnsModule { }
