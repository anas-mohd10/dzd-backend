import { Injectable } from '@angular/core';
import { helpcenterEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelpCenterService {
  helpcenterEndpoints = helpcenterEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  createHelpCenter(data: any) {
    const url = this.commonService.getFullUrl(this.helpcenterEndpoints.create_help_center);
    return this.http.post(`${url}`, data)
  }

  getHelpCenter() {
    const url = this.commonService.getFullUrl(this.helpcenterEndpoints.get_help_center);
    return this.http.get(`${url}`)
  }

  updateHelpCenter(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.helpcenterEndpoints.update_help_center + "?slug=" + slug);
    return this.http.put(`${url}`, data)
  }
  
}
