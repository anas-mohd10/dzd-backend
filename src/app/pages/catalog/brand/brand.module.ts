import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandComponent } from './brand.component';
// import { WidgetsModule } from '../../_metronic/partials';

@NgModule({
  declarations: [BrandComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BrandComponent,
      },
    ]),
    // WidgetsModule,
  ],
})
export class DashboardModule {}
