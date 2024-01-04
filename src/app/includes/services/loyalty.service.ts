import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { loyaltyEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageLoyalty(data: any) {
    const url = this.commonService.getFullUrl(loyaltyEndpoints.manageLoyalty);
    return this.http.post(`${url}`, data);
  }

  loyaltyDetails() {
    const url = this.commonService.getFullUrl(loyaltyEndpoints.loyaltyDetails);
    return this.http.get(`${url}`);
  }
}
