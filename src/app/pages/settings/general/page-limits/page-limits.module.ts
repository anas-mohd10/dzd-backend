import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLimitsRoutingModule } from './page-limits-routing.module';
import { AddPageLimitsComponent } from './add-page-limits/add-page-limits.component';
import { PageLimitsComponent } from './page-limits/page-limits.component';
import { UpdatePageLimitsComponent } from './update-page-limits/update-page-limits.component';


@NgModule({
  declarations: [
    AddPageLimitsComponent,
    PageLimitsComponent,
    UpdatePageLimitsComponent
  ],
  imports: [
    CommonModule,
    PageLimitsRoutingModule
  ]
})
export class PageLimitsModule { }
