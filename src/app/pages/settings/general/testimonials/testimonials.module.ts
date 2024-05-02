import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialsRoutingModule } from './testimonials-routing.module';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';
import { AddTestimonialComponent } from './add-testimonial/add-testimonial.component';
import { UpdateTestimonialComponent } from './update-testimonial/update-testimonial.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetsModule } from 'src/app/shared/partials';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [
    TestimonialListComponent,
    AddTestimonialComponent,
    UpdateTestimonialComponent
  ],
  imports: [
    CommonModule,
    TestimonialsRoutingModule,
    FormsModule,
    WidgetsModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class TestimonialsModule { }
