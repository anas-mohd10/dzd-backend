import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { testimonialEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  testimonialEndpoints = testimonialEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addTestimonial(data: any) {
    const url = this.commonService.getFullUrl(this.testimonialEndpoints.create_testimonial);
    return this.http.post(`${url}`, data);
  }

  getTestimonials() {
    const url = this.commonService.getFullUrl(this.testimonialEndpoints.get_testimonials);
    return this.http.get(`${url}`);
  }

  getActiveTestimonials() {
    const url = this.commonService.getFullUrl(this.testimonialEndpoints.get_active_testimonials);
    return this.http.get(`${url}`);
  }

  getTestimonial(slug: any) {
    const url = this.commonService.getFullUrl(this.testimonialEndpoints.get_testimonial + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateTestimonial(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.testimonialEndpoints.update_testimonial + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
