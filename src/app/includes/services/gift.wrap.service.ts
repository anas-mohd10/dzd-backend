import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { giftWrapEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class GiftWrapService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageGiftWrap(data: any) {
    const url = this.commonService.getFullUrl(giftWrapEndpoints.manageGiftWrap);
    return this.http.post(`${url}`, data);
  }

  giftWrapDetails() {
    const url = this.commonService.getFullUrl(giftWrapEndpoints.giftwrapDetails);
    return this.http.get(`${url}`);
  }
}
