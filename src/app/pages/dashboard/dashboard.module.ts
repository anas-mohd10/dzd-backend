import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../../shared/partials';
import { NgApexchartsModule } from 'ng-apexcharts'
import { ReactiveFormsModule } from '@angular/forms';
import { MonthStatsComponent } from './month-stats/month-stats.component';

@NgModule({
  declarations: [DashboardComponent, MonthStatsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
    NgApexchartsModule,
    WidgetsModule,
    ReactiveFormsModule
  ],
})
export class DashboardModule { }
