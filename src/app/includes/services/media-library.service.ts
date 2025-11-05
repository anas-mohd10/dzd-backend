import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { mediaEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  endpoints = mediaEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  getMedias(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.medias);
    return this.http.post(`${url}`, data)
  }

  getMediaDetails(params: string) {
    const url = this.commonService.getFullUrl(this.endpoints.medias + `/${params}`);
    return this.http.get(`${url}`)
  }

  updateMedia(params: string, data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.updateMedia + `/${params}`);
    return this.http.put(`${url}`, data)
  }

  saveMediaUrls(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.mediaUrls);
    return this.http.post(`${url}`, data)
  }

  deleteMedias(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.deleteMedias);
    return this.http.post(`${url}`, data)
  }

  addMedias(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.addMedias);
    return this.http.post(`${url}`, data)
  }

  checkMediaRelation(mediaSlug: string) {
    const url = this.commonService.getFullUrl(this.endpoints.checkMediaRelation + `/${mediaSlug}`);
    return this.http.get(`${url}`)
  }
}
