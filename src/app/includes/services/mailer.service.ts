import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { mailerEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MailerService {
  endpoints = mailerEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageMailers(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.manageMailers);
    return this.http.post(`${url}`, data);
  }

  mailerDetails() {
    const url = this.commonService.getFullUrl(this.endpoints.mailerDetails);
    return this.http.get(`${url}`);
  }
}
