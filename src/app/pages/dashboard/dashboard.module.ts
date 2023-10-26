import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../../shared/partials';
import { NgApexchartsModule } from 'ng-apexcharts'

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: DashboardComponent,
    },
    ]),
    NgApexchartsModule,
    WidgetsModule,
  ],
})
export class DashboardModule { }
