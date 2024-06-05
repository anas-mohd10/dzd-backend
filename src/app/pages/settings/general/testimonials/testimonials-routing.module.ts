import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTestimonialComponent } from './add-testimonial/add-testimonial.component';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';
import { UpdateTestimonialComponent } from './update-testimonial/update-testimonial.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: TestimonialListComponent, canActivate: [PermissionGuard] },
  { path: 'add', component: AddTestimonialComponent, canActivate: [PermissionGuard] },
  { path: 'update', component: UpdateTestimonialComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestimonialsRoutingModule { }
