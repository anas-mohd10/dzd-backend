import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { faqEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  faqEndpoints = faqEndpoints;

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addFaq(data: any) {
    const url = this.commonService.getFullUrl(this.faqEndpoints.createFaq);
    return this.http.post(`${url}`, data)
  }

  getFaqs() {
    const url = this.commonService.getFullUrl(this.faqEndpoints.faqs);
    return this.http.get(`${url}`)
  }

  getActiveFaq() {
    const url = this.commonService.getFullUrl(this.faqEndpoints.activeFaqs);
    return this.http.get(`${url}`)
  }

  getFaq(faqId: string) {
    const url = this.commonService.getFullUrl(this.faqEndpoints.faqDetails + `/${faqId}`);
    return this.http.get(`${url}`)
  }

  updateFaq(data: any) {
    const url = this.commonService.getFullUrl(this.faqEndpoints.updateFaq);
    return this.http.put(`${url}`, data)
  }

  deleteFaq(faqId: string) {
    const url = this.commonService.getFullUrl(this.faqEndpoints.deleteFaq + `/${faqId}`);
    return this.http.delete(`${url}`)
  }
}
