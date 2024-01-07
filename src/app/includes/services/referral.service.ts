import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { referralEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';


@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageReferral(data: any) {
    const url = this.commonService.getFullUrl(referralEndpoints.manageReferral);
    return this.http.post(`${url}`, data);
  }

  referralProgram(){
    const url = this.commonService.getFullUrl(referralEndpoints.referralProgram);
    return this.http.get(`${url}`);
  }

  getInvitedCustomers(query: any){
    const url = this.commonService.getFullUrl(referralEndpoints.invitedCustomers);
    return this.http.post(`${url}`, query);
  }
}
