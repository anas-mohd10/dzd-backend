import { Injectable } from '@angular/core';
import { aboutEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  aboutEndpoints = aboutEndpoints
  constructor(private http: HttpClient, private commonService: CommonService) { }

  manageAbout(data: any) {
    const url = this.commonService.getFullUrl(this.aboutEndpoints.manage_about);
    return this.http.post(`${url}`, data)
  }

  getAboutDetails() {
    const url = this.commonService.getFullUrl(this.aboutEndpoints.get_about_details);
    return this.http.get(`${url}`)
  }
}
