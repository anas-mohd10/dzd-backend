import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorsComponent } from '../errors/errors.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ErrorsComponent,
    Error404Component,
    Error500Component,
    AccessDeniedComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule { }
