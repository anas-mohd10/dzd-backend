import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestimonialsRoutingModule } from './testimonials-routing.module';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';
import { AddTestimonialComponent } from './add-testimonial/add-testimonial.component';
import { UpdateTestimonialComponent } from './update-testimonial/update-testimonial.component';


@NgModule({
  declarations: [
    TestimonialListComponent,
    AddTestimonialComponent,
    UpdateTestimonialComponent
  ],
  imports: [
    CommonModule,
    TestimonialsRoutingModule
  ]
})
export class TestimonialsModule { }
