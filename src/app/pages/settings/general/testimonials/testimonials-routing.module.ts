import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTestimonialComponent } from './add-testimonial/add-testimonial.component';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';
import { UpdateTestimonialComponent } from './update-testimonial/update-testimonial.component';

const routes: Routes = [
  { path: '', component: TestimonialListComponent },
  { path: 'add', component: AddTestimonialComponent },
  { path: 'update', component: UpdateTestimonialComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestimonialsRoutingModule { }
