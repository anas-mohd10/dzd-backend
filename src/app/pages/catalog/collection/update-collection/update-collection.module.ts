import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdateCollectionComponent } from './update-collection.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [UpdateCollectionComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: 'collection/update',
        component: UpdateCollectionComponent,
      },
    ]),
  ],
})
export class UpdateCollectionModule {}
