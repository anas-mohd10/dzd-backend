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

  getProductbyId(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.product_by_prodid);
    return this.http.post(`${url}`, data);
  }

  getProduct() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product);
    return this.http.get(`${url}`);
  }

  getProductById(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product_by_id);
    return this.http.post(`${url}`, data);
  }

  getProductByPage(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product_page + "?page=" + page + "&limit=" + limit);
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

  searchProducts(query: any, page: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.search_product + "?page=" + page);
    return this.http.post(`${url}`, query);
  }

  findProducts(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.search_products);
    return this.http.post(`${url}`, data);
  }

  archivedProducts(query: any, page: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.archive_product + "?page=" + page);
    return this.http.post(`${url}`, query);
  }

  restoreProducts(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.restore_product);
    return this.http.post(`${url}`, query);
  }

  updateProduct(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.update_product + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }

  productImages(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.product_images);
    return this.http.post(`${url}`, query);
  }

  productThumbnailImages(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.thumbnail_images);
    return this.http.post(`${url}`, query);
  }

  bulkFileUpload(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.products_bulk_file_upload);
    return this.http.post(`${url}`, query);
  }

  bulkMediaUpload(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.products_bulk_image_upload);
    return this.http.post(`${url}`, query);
  }

  bulkThumbnailUpload(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.products_bulk_thumbnail_upload);
    return this.http.post(`${url}`, query);
  }

}
