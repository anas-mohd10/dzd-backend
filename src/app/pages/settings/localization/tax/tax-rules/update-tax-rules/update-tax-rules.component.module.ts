import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdateTaxRulesComponent } from './update-tax-rules.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UpdateTaxRulesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: UpdateTaxRulesComponent },
    ]),
  ],
})
export class UpdateTaxClassModule { }
