import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogListingComponent } from './catalog-listing/catalog-listing.component';
import { CreateCatalogComponent } from './create-catalog/create-catalog.component';
import { UpdateCatalogComponent } from './update-catalog/update-catalog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    CatalogListingComponent,
    CreateCatalogComponent,
    UpdateCatalogComponent
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    DragDropModule,
    TooltipModule.forRoot()
  ]
})
export class CatalogsModule { }
