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
    console.log(url);
    return this.http.post(`${url}`, data);
  }

  getBanners() {
    const url = this.commonService.getFullUrl(this.bannerEndpoints.get_banners);
    return this.http.get(`${url}`);
  }

  getBAnner(slug: any) {
    const url = this.commonService.getFullUrl(this.bannerEndpoints.get_banners + "?slug=" + slug);
    return this.http.get(`${url}`);
  }
}
