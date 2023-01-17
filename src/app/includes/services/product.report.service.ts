import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { productEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductReportService {
  productEndpoints = productEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getProductReport() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product_reports);
    return this.http.post(`${url}`, {});
  }
}
