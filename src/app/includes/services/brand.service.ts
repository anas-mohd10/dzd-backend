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

  updateBrandMedias(data: any, type: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.updateBrandMedias + `/${type}`);
    return this.http.put(`${url}`, data);
  }

  removeCoverMedia(brand: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.removeCoverMedia + `/${brand}`);
    return this.http.get(`${url}`);
  }

  getBrands(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.get_brand + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`);
  }

  getActiveBrands() {
    const url = this.commonService.getFullUrl(this.brandEndpoints.getActiveBrands);
    return this.http.get(`${url}`);
  }

  getBrandBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.brandDetails + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateBrand(queryData: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.updateBrand);
    return this.http.put(`${url}`, queryData);
  }

  deleteBrand(brandId: string) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.deleteBrand);
    return this.http.delete(`${url}/${brandId}`);
  }

  searchBrands(query: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.searchBrands);
    return this.http.post(`${url}`, query);
  }

  restoreBrand(brandId: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.restoreBrand + '/' + brandId);
    return this.http.put(`${url}`, {});
  }

  bulkFileUpload(data: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.brands_bulk_file_upload);
    return this.http.post(`${url}`, data);
  }

  bulkImageUpload(data: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.brands_bulk_image_upload);
    return this.http.post(`${url}`, data);
  }

  createBrands(data: any) {
    const url = this.commonService.getFullUrl(this.brandEndpoints.createBrands);
    return this.http.post(`${url}`, data);
  }

  getBrandDetails(keyword: string, page: number = 1, type: string = 'active') {
    const url = this.commonService.getFullUrl(this.brandEndpoints.getBrands + `?page=${page}&type=${type}&keyword=${keyword}`);
    return this.http.get(`${url}`);
  }
}
