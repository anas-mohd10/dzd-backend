import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerReportListComponent } from './customer-report-list/customer-report-list.component';

const routes: Routes = [
  {path: '', component: CustomerReportListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReportRoutingModule { }
