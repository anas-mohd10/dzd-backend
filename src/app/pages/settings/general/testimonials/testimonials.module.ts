import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestimonialsRoutingModule } from './testimonials-routing.module';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';
import { AddTestimonialComponent } from './add-testimonial/add-testimonial.component';
import { UpdateTestimonialComponent } from './update-testimonial/update-testimonial.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetsModule } from 'src/app/shared/partials';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    TestimonialListComponent,
    AddTestimonialComponent,
    UpdateTestimonialComponent
  ],
  imports: [
    CommonModule,
    TestimonialsRoutingModule,
    DataTablesModule,
    FormsModule,
    WidgetsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class TestimonialsModule { }
