import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdateCollectionComponent } from './update-collection.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [UpdateCollectionComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    DragDropModule,
    NgSelectModule,
    ImageCropperModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    RouterModule.forChild([{
      path: '',
      component: UpdateCollectionComponent,
    }]),
  ],
})
export class UpdateCollectionModule { }
