import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreDesignsRoutingModule } from './store-designs-routing.module';
import { HomeComponent } from './home/home.component';
import { DesignSharedModule } from './shared/design.shared.module';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    AccordionModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    TooltipModule,
    DesignSharedModule,
    DragDropModule,
    StoreDesignsRoutingModule
  ]
})
export class StoreDesignsModule { }
