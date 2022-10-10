import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollectionListComponent } from './collection-list.component';
import { DataTablesModule } from 'angular-datatables';
@NgModule({
  declarations: [CollectionListComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CollectionListComponent,
      },
    ]),
  ],
})
export class CollectionModule { }
