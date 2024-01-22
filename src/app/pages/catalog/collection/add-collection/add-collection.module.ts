import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddCollectionComponent } from './add-collection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [AddCollectionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: AddCollectionComponent,
    }]),
  ],
})
export class AddCollectionModule { }
