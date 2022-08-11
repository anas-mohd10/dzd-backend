import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { socialMediaEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {
  socialMediaEndpoints = socialMediaEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addSocialMediaLinks(data: any) {
    const url = this.commonService.getFullUrl(this.socialMediaEndpoints.add_social);
    return this.http.post(`${url}`, data);
  }

  getSocialMediaLinks() {
    const url = this.commonService.getFullUrl(this.socialMediaEndpoints.get_social);
    return this.http.get(`${url}`);
  }
}
