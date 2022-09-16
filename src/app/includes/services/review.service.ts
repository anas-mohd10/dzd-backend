import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { reviewsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  reviewsEndpoints = reviewsEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addReview(data: any) {
    const url = this.commonService.getFullUrl(this.reviewsEndpoints.create_review);
    return this.http.post(`${url}`, data);
  }

  getReviews() {
    const url = this.commonService.getFullUrl(this.reviewsEndpoints.get_reviews);
    return this.http.get(`${url}`);
  }

  getReview(code: any) {
    const url = this.commonService.getFullUrl(this.reviewsEndpoints.get_review + "?code=" + code);
    return this.http.get(`${url}`);
  }

  updateReview(code: any, data: any) {
    const url = this.commonService.getFullUrl(this.reviewsEndpoints.update_review + "?code=" + code);
    return this.http.put(`${url}`, data);
  }
}
