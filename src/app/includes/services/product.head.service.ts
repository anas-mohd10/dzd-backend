import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { productHeadEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProductHeadService {

  productHeadEndpoints = productHeadEndpoints
  constructor(private http: HttpClient, private commonService: CommonService) { }

  addProductHead(data: any) {
    const url = this.commonService.getFullUrl(this.productHeadEndpoints.add_product_head);
    return this.http.post(`${url}`, data);
  }

  searchProductHead(data: any) {
    const url = this.commonService.getFullUrl(this.productHeadEndpoints.search_product_head);
    return this.http.post(`${url}`, data);
  }

  productHeadDetails(product: string) {
    const url = this.commonService.getFullUrl(this.productHeadEndpoints.product_head + `/${product}`);
    return this.http.get(`${url}`);
  }

  getDetails(product: string) {
    const url = this.commonService.getFullUrl(this.productHeadEndpoints.getDetails + `/${product}`);
    return this.http.get(`${url}`);
  }

  getAllProductHead() {
    const url = this.commonService.getFullUrl(this.productHeadEndpoints.product_heads);
    return this.http.get(`${url}`);
  }

  updateProductHead(data: any) {
    const url = this.commonService.getFullUrl(this.productHeadEndpoints.update_product_head);
    return this.http.put(`${url}`, data);
  }

  productHeadImages(data: any) {
    const url = this.commonService.getFullUrl(this.productHeadEndpoints.product_head_images);
    return this.http.post(`${url}`, data);
  }

  parentDetails(productSlug: any) {
    const url = this.commonService.getFullUrl(this.productHeadEndpoints.parentDetails + `/${productSlug}`);
    return this.http.get(`${url}`);
  }
}
