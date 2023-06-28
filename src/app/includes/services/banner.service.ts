import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { bannerEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  bannerEndpoints = bannerEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addBaner(data: any) {
    const url = this.commonService.getFullUrl(this.bannerEndpoints.add_banner);
    return this.http.post(`${url}`, data);
  }

  getBanners() {
    const url = this.commonService.getFullUrl(this.bannerEndpoints.get_banners);
    return this.http.get(`${url}`);
  }

  searchBanners(data: any) {
    const url = this.commonService.getFullUrl(this.bannerEndpoints.get_banners_page);
    return this.http.post(`${url}`, data);
  }

  getBannersCount() {
    const url = this.commonService.getFullUrl(this.bannerEndpoints.get_banners_count);
    return this.http.get(`${url}`);
  }

  getBanner(slug: any) {
    const url = this.commonService.getFullUrl(this.bannerEndpoints.get_banner + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateBanner(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.bannerEndpoints.update_banner + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
