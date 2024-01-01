import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetsComponent } from './assets/assets.component';

@NgModule({
  declarations: [
    PaginationComponent,
    AssetsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    PaginationComponent,
    AssetsComponent
  ]
})
export class SharedModule { }
