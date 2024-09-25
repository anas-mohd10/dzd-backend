import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { storeEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  storeEndpoints = storeEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  add(data: any) {
    const url = this.commonService.getFullUrl(this.storeEndpoints.add_store);
    return this.http.post(`${url}`, data);
  }

  getStores() {
    const url = this.commonService.getFullUrl(this.storeEndpoints.stores);
    return this.http.get(`${url}`);
  }

  getClickPoints() {
    const url = this.commonService.getFullUrl(this.storeEndpoints.click_points);
    return this.http.get(`${url}`);
  }

  getStoreDetails(data: any) {
    const url = this.commonService.getFullUrl(this.storeEndpoints.store_details);
    return this.http.post(`${url}`, data);
  }

  update(data: any) {
    const url = this.commonService.getFullUrl(this.storeEndpoints.update_store);
    return this.http.put(`${url}`, data);
  }

  delete(storeId: string) {
    const url = this.commonService.getFullUrl(this.storeEndpoints.deleteStore);
    return this.http.delete(`${url}/${storeId}`);
  }
}
