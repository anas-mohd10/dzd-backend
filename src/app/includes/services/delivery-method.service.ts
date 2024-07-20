import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { deliveryMethods } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class DeliveryMethodService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addMethod(data: any) {
    const url = this.commonService.getFullUrl(deliveryMethods.add);
    return this.http.post(`${url}`, data)
  }

  getMethods(query?: string) {
    const url = this.commonService.getFullUrl(deliveryMethods.get + `?type=${query}`);
    return this.http.get(`${url}`)
  }

  getMethod(methodId: string) {
    const url = this.commonService.getFullUrl(deliveryMethods.details + '/' + methodId);
    return this.http.get(`${url}`)
  }

  updateMethod(data: any) {
    const url = this.commonService.getFullUrl(deliveryMethods.update);
    return this.http.put(`${url}`, data)
  }

  deleteMethod(data: string) {
    const url = this.commonService.getFullUrl(deliveryMethods.delete);
    return this.http.delete(`${url}/${data}`)
  }
}
