import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { contentEndoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  contentEndoints = contentEndoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageContent(data: any) {
    const url = this.commonService.getFullUrl(this.contentEndoints.manageContent);
    return this.http.post(`${url}`, data);
  }

  getContents() {
    const url = this.commonService.getFullUrl(this.contentEndoints.getContents);
    return this.http.get(`${url}`);
  }

  manageContactCms(data: any) {
    const url = this.commonService.getFullUrl(this.contentEndoints.manageContactCms);
    return this.http.post(`${url}`, data);
  }

  getContactCmsDetails(){
    const url = this.commonService.getFullUrl(this.contentEndoints.contactCmsDetails);
    return this.http.get(`${url}`);
  }
}
