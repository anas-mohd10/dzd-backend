import { Injectable } from '@angular/core';
import { staticPageEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StaticPageService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  create(data: any) {
    const url = this.CommonService.getFullUrl(staticPageEndpoints.add);
    return this.HttpClient.post(`${url}`, data)
  }

  update(data: any) {
    const url = this.CommonService.getFullUrl(staticPageEndpoints.update);
    return this.HttpClient.put(`${url}`, data)
  }

  delete(pageId: string) {
    const url = this.CommonService.getFullUrl(staticPageEndpoints.delete);
    return this.HttpClient.delete(`${url}/${pageId}`)
  }

  details(pageId: string) {
    const url = this.CommonService.getFullUrl(staticPageEndpoints.details);
    return this.HttpClient.get(`${url}/${pageId}`)
  }

  search(keyword: string, page: number, limit: number) {
    const url = this.CommonService.getFullUrl(staticPageEndpoints.search);
    return this.HttpClient.get(`${url}?keyword=${keyword}&page=${page}&limit=${limit}`)
  }
}
