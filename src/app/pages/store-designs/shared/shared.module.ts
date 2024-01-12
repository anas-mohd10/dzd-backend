import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignTopbarComponent } from './design-topbar/design-topbar.component';
import { DesignSidebarComponent } from './design-sidebar/design-sidebar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DesignTopbarComponent,
    DesignSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    DesignTopbarComponent,
    DesignSidebarComponent
  ]
})
export class SharedModule { }
