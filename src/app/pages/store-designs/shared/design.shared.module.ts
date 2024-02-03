import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignTopbarComponent } from './design-topbar/design-topbar.component';
import { DesignSidebarComponent } from './design-sidebar/design-sidebar.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ScreensComponent } from './screens/screens.component';

@NgModule({
  declarations: [
    DesignTopbarComponent,
    DesignSidebarComponent,
    ScreensComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule
  ],
  exports: [
    DesignTopbarComponent,
    DesignSidebarComponent,
    ScreensComponent
  ]
})
export class DesignSharedModule { }
