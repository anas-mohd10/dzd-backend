import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewsListComponent } from './reviews-list/reviews-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { StarRatingComponent } from './reviews-list/star-rating/star-rating.component';

@NgModule({
  declarations: [
    ReviewsListComponent,
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStarRatingModule,
    DataTablesModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class ReviewsModule { }
