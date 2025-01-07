import { Injectable } from '@angular/core';
import { toastEndpoints } from 'src/app/config/endpoints';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastEndpoints = toastEndpoints

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createToast(data: any) {
    const url = this.CommonService.getFullUrl(this.toastEndpoints.createToast);
    return this.HttpClient.post(`${url}`, data);
  }

  getToast(lang: string) {
    const url = this.CommonService.getFullUrl(this.toastEndpoints.toast + `/${lang}`);
    return this.HttpClient.get(`${url}`);
  }

  updateToast(data: any) {
    const url = this.CommonService.getFullUrl(this.toastEndpoints.updateToast);
    return this.HttpClient.put(`${url}`, data);
  }
}
