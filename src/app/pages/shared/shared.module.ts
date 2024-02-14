import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetsComponent } from './assets/assets.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModuleNotificationComponent } from './module-notification/module-notification.component';
import { BrandDropdownComponent } from './brand-dropdown/brand-dropdown.component';
import { CategoryDropdownComponent } from './category-dropdown/category-dropdown.component';

@NgModule({
  declarations: [
    PaginationComponent,
    AssetsComponent,
    ModuleNotificationComponent,
    BrandDropdownComponent,
    CategoryDropdownComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TabsModule
  ],
  exports: [
    PaginationComponent,
    AssetsComponent,
    ModuleNotificationComponent,
    BrandDropdownComponent,
    CategoryDropdownComponent
  ]
})
export class SharedModule { }
