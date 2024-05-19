import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [AddProductComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    ImageCropperModule,
    DragDropModule,
    TabsModule,
    AngularEditorModule,
    NgSelectModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: AddProductComponent, }]),
  ],
})

export class AddProductModule { }
