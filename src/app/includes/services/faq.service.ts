import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { faqEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  faqEndpoints = faqEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addFAQ(data: any) {
    const url = this.commonService.getFullUrl(this.faqEndpoints.create_faq);
    return this.http.post(`${url}`, data)
  }

  getFaqs() {
    const url = this.commonService.getFullUrl(this.faqEndpoints.get_faqs);
    return this.http.get(`${url}`)
  }

  getActiveFaq() {
    const url = this.commonService.getFullUrl(this.faqEndpoints.get_active_faq);
    return this.http.get(`${url}`)
  }

  getFaq(slug: any) {
    const url = this.commonService.getFullUrl(this.faqEndpoints.get_faq_slug + "?slug=" + slug);
    return this.http.get(`${url}`)
  }

  updateFaq(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.faqEndpoints.update_faq + "?slug=");
    return this.http.put(`${url}`, data)
  }
}
