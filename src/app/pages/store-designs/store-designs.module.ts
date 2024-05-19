import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { StoreDesignsRoutingModule } from './store-designs-routing.module';
import { HomeComponent } from './home/home.component';
import { DesignSharedModule } from './shared/design.shared.module';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogComponent } from './catalog/catalog.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ThemeComponent } from './theme/theme.component';
import { AppImagesComponent } from './app-images/app-images.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    HomeComponent,
    CatalogComponent,
    ThemeComponent,
    AppImagesComponent,
    ContactComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    AccordionModule,
    FormsModule,
    SharedModule,
    BsDatepickerModule,
    AngularEditorModule,
    ReactiveFormsModule,
    TooltipModule,
    DesignSharedModule,
    DragDropModule,
    StoreDesignsRoutingModule
  ]
})
export class StoreDesignsModule { }
