import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { PagesListComponent } from './pages-list/pages-list.component';
import { AddPagesComponent } from './add-pages/add-pages.component';
import { UpdatePagesComponent } from './update-pages/update-pages.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ModalModule } from 'ngx-bootstrap/modal';

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
    ModalModule.forRoot(),
    StaticPagesRoutingModule
  ]
})
export class StaticPagesModule { }
