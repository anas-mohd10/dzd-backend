import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddTaxRulesComponent } from './add-tax-rules.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddTaxRulesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: AddTaxRulesComponent, },
    ]),
  ],
})
export class AddTaxClassModule { }
