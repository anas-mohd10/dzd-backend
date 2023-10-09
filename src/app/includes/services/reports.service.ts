import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { reportsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  reportsEndpoints = reportsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  downloadSubscribers() {
    return this.commonService.getFullUrl(this.reportsEndpoints.downloadSubscribers);
  }

  customerReport() {
    return this.commonService.getFullUrl(this.reportsEndpoints.customerReport);
  }

  customerOrderReport() {
    return this.commonService.getFullUrl(this.reportsEndpoints.customerOrderReport);
  }

}
