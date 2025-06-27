import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { Routing } from '../../pages/routing';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { ScriptsInitComponent } from './components/scripts-init/scripts-init.component';
import { AsideMenuComponent } from './components/aside/aside-menu/aside-menu.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: Routing
}];

@NgModule({
  declarations: [
    LayoutComponent,
    AsideComponent,
    HeaderComponent,
    ContentComponent,
    ScriptsInitComponent,
    AsideMenuComponent,
    TopbarComponent,
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InlineSVGModule,
    BsDropdownModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule,
    LayoutComponent,
    AsideComponent,
    HeaderComponent,
    ContentComponent,
    ScriptsInitComponent,
    AsideMenuComponent,
    TopbarComponent,
  ],
})

export class LayoutModule { }
