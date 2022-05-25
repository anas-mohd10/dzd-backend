import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { brandEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  brandEndpoints = brandEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  addBrand(data: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.add_brand);
    return this.http.post(`${url}`, data);
  }

  getBrand(){
    const url = this.commonService.getFullUrl(this.brandEndpoints.get_brand);
    console.log(url)
    return this.http.get(`${url}`);
  }
}
