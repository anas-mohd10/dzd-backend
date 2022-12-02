import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { variantProductEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class VariantProductService {
  variantProductEndpoints = variantProductEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addVariantProduct(data: any) {
    const url = this.commonService.getFullUrl(this.variantProductEndpoints.add_product);
    return this.http.post(`${url}`, data);
  }

  getVariantProduct() {
    const url = this.commonService.getFullUrl(this.variantProductEndpoints.get_product);
    return this.http.get(`${url}`);
  }

  getActiveVariantroduct() {
    const url = this.commonService.getFullUrl(this.variantProductEndpoints.get_active_products);
    return this.http.get(`${url}`);
  }

  getVariantProductBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.variantProductEndpoints.get_product_by_slug + '?slug=' + slug);
    return this.http.get(`${url}`);
  }

  getVariantProductByParent(id: any) {
    const url = this.commonService.getFullUrl(this.variantProductEndpoints.get_product_by_parent + '?id=' + id);
    return this.http.get(`${url}`);
  }

  searchVariantProducts(id: any, page: any, data: any) {
    const url = this.commonService.getFullUrl(this.variantProductEndpoints.search_product + "?page=" + page + "&id=" + id);
    return this.http.post(`${url}`, data);
  }

  getVariantProductNames() {
    const url = this.commonService.getFullUrl(this.variantProductEndpoints.get_product_names);
    return this.http.get(`${url}`);
  }

  updateVariantProduct(id: any, data: any) {
    const url = this.commonService.getFullUrl(this.variantProductEndpoints.update_product + "/" + id);
    return this.http.put(`${url}`, data);
  }
}
