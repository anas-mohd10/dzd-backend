import { Injectable } from '@angular/core';
import { guestCustomerEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GuestCustomersService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  searchGuests(page: number, limit: number, keyword: string) {
    const url = this.commonService.getFullUrl(guestCustomerEndpoints.search + `?page=${page}&limit=${limit}&keyword=${keyword}`);
    return this.http.get(`${url}`)
  }


}
