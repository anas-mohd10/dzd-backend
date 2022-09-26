import { Injectable } from '@angular/core';
import { privacypolicyEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrivacyPolicyService {
  privacypolicyEndpoints = privacypolicyEndpoints
  constructor(private http: HttpClient, private commonService: CommonService) { }

  createPrivacyPolicy(data: any) {
    const url = this.commonService.getFullUrl(this.privacypolicyEndpoints.create_privay_policy);
    return this.http.post(`${url}`, data)
  }

  getPrivacyPolicy() {
    const url = this.commonService.getFullUrl(this.privacypolicyEndpoints.get_privacy_policy);
    return this.http.get(`${url}`)
  }

  updatePrivacyPolicy(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.privacypolicyEndpoints.update_privacy_policy + "?slug=" + slug);
    return this.http.put(`${url}`, data)
  }

}
