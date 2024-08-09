import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqListComponent } from './faq-list/faq-list.component';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { UpdateFaqComponent } from './update-faq/update-faq.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    FaqListComponent,
    AddFaqComponent,
    UpdateFaqComponent
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    FormsModule,
    AngularEditorModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class FaqModule { }
