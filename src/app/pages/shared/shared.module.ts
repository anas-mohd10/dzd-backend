import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetsComponent } from './assets/assets.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModuleNotificationComponent } from './module-notification/module-notification.component';

@NgModule({
  declarations: [
    PaginationComponent,
    AssetsComponent,
    ModuleNotificationComponent
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
    ModuleNotificationComponent
  ]
})
export class SharedModule { }
