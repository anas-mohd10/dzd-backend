import { Injectable } from '@angular/core';
import { popupEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  endpoints = popupEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }


  managePopup() {
    const url = this.commonService.getFullUrl(this.endpoints.managePopup);
    return this.http.get(`${url}`);
  }

  popupDetails() {
    const url = this.commonService.getFullUrl(this.endpoints.popupDetails);
    return this.http.get(`${url}`);
  }

}
