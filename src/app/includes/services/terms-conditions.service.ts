import { Injectable } from '@angular/core';
import { termsconditionsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TermsConditionsService {
  termsconditionsEndpoints = termsconditionsEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  createTermsConditions(data: any) {
    const url = this.commonService.getFullUrl(this.termsconditionsEndpoints.create_terms_conditions);
    return this.http.post(`${url}`, data)
  }

  getTermsConditions() {
    const url = this.commonService.getFullUrl(this.termsconditionsEndpoints.get_terms_conditions);
    return this.http.get(`${url}`)
  }

  updateTermsConditions(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.termsconditionsEndpoints.update_terms_conditions + "?slug=" + slug);
    return this.http.put(`${url}`, data)
  }

}
