import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignTopbarComponent } from './design-topbar/design-topbar.component';
import { DesignSidebarComponent } from './design-sidebar/design-sidebar.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    DesignTopbarComponent,
    DesignSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule
  ],
  exports: [
    DesignTopbarComponent,
    DesignSidebarComponent
  ]
})
export class DesignSharedModule { }
