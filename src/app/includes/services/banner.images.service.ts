import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bannerImageEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class BannerImagesService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createBannerImage(data: any) {
    const url = this.CommonService.getFullUrl(bannerImageEndpoints.createBannerImage);
    return this.HttpClient.post(`${url}`, data)
  }

  updateBannerImage(data: any) {
    const url = this.CommonService.getFullUrl(bannerImageEndpoints.updateBannerImage);
    return this.HttpClient.put(`${url}`, data)
  }

  searchBannerImages() {
    const url = this.CommonService.getFullUrl(bannerImageEndpoints.bannerimages);
    return this.HttpClient.get(`${url}`)
  }

  deleteBannerImage(id: string) {
    const url = this.CommonService.getFullUrl(bannerImageEndpoints.deleteBannerImage);
    return this.HttpClient.delete(`${url}/${id}`)
  }
}
