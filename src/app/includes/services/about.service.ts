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

  createAbout(data: any) {
    const url = this.commonService.getFullUrl(this.aboutEndpoints.create_about);
    return this.http.post(`${url}`, data)
  }

  getAbout() {
    const url = this.commonService.getFullUrl(this.aboutEndpoints.get_about);
    return this.http.get(`${url}`)
  }

  updateAbout(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.aboutEndpoints.update_about + "?slug=" + slug);
    return this.http.put(`${url}`, data)
  }

}
