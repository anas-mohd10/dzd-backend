import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AttributeComponent } from './attribute-list.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AttributeComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    RouterModule.forChild([
      {
        path: 'attribute',
        component: AttributeComponent,
      },
    ]),
  ],
})
export class AttributeModule {}
