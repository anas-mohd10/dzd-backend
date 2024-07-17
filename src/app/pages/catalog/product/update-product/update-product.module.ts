import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdateProductComponent } from './update-product.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [UpdateProductComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    ImageCropperModule,
    DragDropModule,
    NgSelectModule,
    TabsModule,
    SharedModule,
    AngularEditorModule,
    RouterModule.forChild([{ path: '', component: UpdateProductComponent, }]),
  ],
})
export class UpdateProductModule { }
