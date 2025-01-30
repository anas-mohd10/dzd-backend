import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { customMessagesEndpoitns as smsTemplateEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class SmsTemplateService {
  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageTemplate(data: any) {
    const url = this.commonService.getFullUrl(smsTemplateEndpoints.manageCustomMessage);
    return this.http.post(`${url}`, data);
  }

  getTemplate(type: string) {
    const url = this.commonService.getFullUrl(smsTemplateEndpoints.getMessages + `?type=${type}`);
    return this.http.get(`${url}`);
  }
}
