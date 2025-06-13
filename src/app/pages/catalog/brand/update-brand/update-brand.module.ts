import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdateBrandComponent } from './update-brand.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [UpdateBrandComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: UpdateBrandComponent,
    }]),
  ],
})
export class UpdateBrandModule { }
