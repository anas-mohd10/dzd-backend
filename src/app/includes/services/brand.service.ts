import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { brandEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  brandEndpoints = brandEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addBrand(data: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.add_brand);
    return this.http.post(`${url}`, data);
  }

  getBrand() {
    const url = this.commonService.getFullUrl(this.brandEndpoints.get_brand);
    return this.http.get(`${url}`);
  }

  getBrands(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.get_brand + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`);
  }

  getActiveBrands() {
    const url = this.commonService.getFullUrl(this.brandEndpoints.get_active_brand);
    return this.http.get(`${url}`);
  }

  getBrandBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.get_brand_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateBrand(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.update_brand + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }

  searchBrand(query: any, page: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.search_brand + "?page=" + page);
    return this.http.post(`${url}`, query);
  }

  getBrandCount() {
    const url = this.commonService.getFullUrl(this.brandEndpoints.get_brand_count);
    return this.http.get(`${url}`);
  }

  getArchivedBrands(query: any, page: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.archive_brand + "?page=" + page);
    return this.http.post(`${url}`, query);
  }

  restoreBrand(query: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.restore_brand);
    return this.http.post(`${url}`, query);
  }
}
