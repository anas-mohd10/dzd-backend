import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErpSettingsListComponent } from './erp-settings-list/erp-settings-list.component';

const routes: Routes = [
  { path: '', component: ErpSettingsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErpSettingsRoutingModule { }
