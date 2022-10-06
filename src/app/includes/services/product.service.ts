import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { productEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productEndpoints = productEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addProduct(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.add_product);
    return this.http.post(`${url}`, data);
  }

  getProduct() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product);
    return this.http.get(`${url}`);
  }

  getProductsCount() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_products_count);
    return this.http.get(`${url}`);
  }

  getActiveProduct() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_active_products);
    return this.http.get(`${url}`);
  }

  getProductBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product_by_slug + '?slug=' + slug);
    return this.http.get(`${url}`);
  }

  getProductNames() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product_names);
    return this.http.get(`${url}`);
  }

  searchProducts(query: any, page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.search_product + "?page=" + page + "&limit=" + limit);
    return this.http.post(`${url}`, query);
  }

  updateProduct(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.update_product + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
