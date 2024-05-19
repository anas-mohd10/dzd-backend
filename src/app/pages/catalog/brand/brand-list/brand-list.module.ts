import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandComponent } from './brand-list.component';
import { BrandCardComponent } from '../brand-card/brand-card.component';
import { ArchivedBrandComponent } from '../archived-brand/archived-brand.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

@NgModule({
  declarations: [BrandComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: BrandCardComponent },
      { path: 'archived', component: ArchivedBrandComponent, canActivate: [PermissionGuard] }
    ]),
  ],
})

export class BrandModule { }
