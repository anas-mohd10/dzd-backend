import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { testimonialEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  endpoints = testimonialEndpoints

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  addTestimonial(data: any) {
    const url = this.CommonService.getFullUrl(this.endpoints.create);
    return this.HttpClient.post(`${url}`, data);
  }

  getTestimonials(data: any) {
    const url = this.CommonService.getFullUrl(this.endpoints.testimonials);
    return this.HttpClient.post(`${url}`, data);
  }

  searchTestimonials(data: any, page: number, limit: number) {
    const url = this.CommonService.getFullUrl(this.endpoints.searchTestimonials + `?page=${page}&limit=${limit}`);
    return this.HttpClient.post(`${url}`, data);
  }

  getActiveTestimonials() {
    const url = this.CommonService.getFullUrl(this.endpoints.get_active_testimonials);
    return this.HttpClient.get(`${url}`);
  }

  getTestimonial(id: string) {
    const url = this.CommonService.getFullUrl(this.endpoints.getDetails + "?id=" + id);
    return this.HttpClient.get(`${url}`);
  }

  updateTestimonial(data: any) {
    const url = this.CommonService.getFullUrl(this.endpoints.update);
    return this.HttpClient.put(`${url}`, data);
  }
}
