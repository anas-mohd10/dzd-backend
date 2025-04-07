import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { PagesListComponent } from './pages-list/pages-list.component';
import { AddPagesComponent } from './add-pages/add-pages.component';
import { UpdatePagesComponent } from './update-pages/update-pages.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
  declarations: [
    PagesListComponent,
    AddPagesComponent,
    UpdatePagesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    StaticPagesRoutingModule
  ]
})
export class StaticPagesModule { }
