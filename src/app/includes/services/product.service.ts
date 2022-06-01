import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { productEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productEndpoints = productEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  addProduct(data: any) {
    const url = this.commonService.getFullUrl(
      this.productEndpoints.add_product
    );
    return this.http.post(`${url}`, data);
  }

  getProduct() {
    const url = this.commonService.getFullUrl(
      this.productEndpoints.get_product
    );
    return this.http.get(`${url}`);
  }

  getActiveProduct() {
    const url = this.commonService.getFullUrl(
      this.productEndpoints.get_active_products
    );
    return this.http.get(`${url}`);
  }

  getProductById(id: any) {
    const url = this.commonService.getFullUrl(
      this.productEndpoints.get_product_by_id + '/' + id
    );
    return this.http.get(`${url}`);
  }
}
