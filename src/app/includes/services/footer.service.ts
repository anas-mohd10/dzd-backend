import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { footerEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageFooterDetails(data: any) {
    const url = this.commonService.getFullUrl(footerEndpoints.manageFooterDetails);
    return this.http.post(`${url}`, data);
  }

  footerDetails() {
    const url = this.commonService.getFullUrl(footerEndpoints.footerDetails);
    return this.http.get(`${url}`);
  }
}
