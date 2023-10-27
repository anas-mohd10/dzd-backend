import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { reviewsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  reviewsEndpoints = reviewsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  updateReview(data: any) {
    const url = this.commonService.getFullUrl(this.reviewsEndpoints.update_review + "?action=update");
    return this.http.put(`${url}`, data);
  }

  deleteReview(data: any) {
    const url = this.commonService.getFullUrl(this.reviewsEndpoints.update_review + "?action=delete");
    return this.http.put(`${url}`, data);
  }

  searchReviews(data: any) {
    const url = this.commonService.getFullUrl(this.reviewsEndpoints.search_reviews);
    return this.http.post(`${url}`, data);
  }

  productReviews(data: any) {
    const url = this.commonService.getFullUrl(this.reviewsEndpoints.productReviews);
    return this.http.post(`${url}`, data);
  }
}
