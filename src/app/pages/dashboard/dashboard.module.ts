import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonthStatsComponent } from './month-stats/month-stats.component';
import { SharedModule } from '../shared/shared.module';
import { NewOrdersComponent } from './new-orders/new-orders.component';
import { QuaterlyStatsComponent } from './quaterly-stats/quaterly-stats.component';

@NgModule({
  declarations: [DashboardComponent, MonthStatsComponent, NewOrdersComponent, QuaterlyStatsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
    NgApexchartsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class DashboardModule { }
