import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTermsConditionsComponent } from './add-terms-conditions/add-terms-conditions.component';

const routes: Routes = [
  { path:'' , component : AddTermsConditionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsConditionsRoutingModule { }
