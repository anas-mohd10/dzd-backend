import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sitemapEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createSitemap(data: any) {
    const url = this.CommonService.getFullUrl(sitemapEndpoints.createSitemap);
    return this.HttpClient.post(`${url}`, data)
  }

  shippingDetails() {
    const url = this.CommonService.getFullUrl(sitemapEndpoints.getSitemaps);
    return this.HttpClient.get(`${url}`)
  }
}
