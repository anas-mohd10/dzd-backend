import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../../shared/partials';
import { NgApexchartsModule } from 'ng-apexcharts'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonthStatsComponent } from './month-stats/month-stats.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent, MonthStatsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
    NgApexchartsModule,
    SharedModule,
    FormsModule,
    WidgetsModule,
    ReactiveFormsModule
  ],
})
export class DashboardModule { }
