import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { pageCoversEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class PageCoversService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createPageCover(data: any) {
    const url = this.CommonService.getFullUrl(pageCoversEndpoints.createPageCover);
    return this.HttpClient.post(`${url}`, data);
  }

  updatePageCover(data: any) {
    const url = this.CommonService.getFullUrl(pageCoversEndpoints.updatePageCover);
    return this.HttpClient.put(`${url}`, data);
  }

  deletePageCover(id: string) {
    const url = this.CommonService.getFullUrl(pageCoversEndpoints.deletePageCover + `/${id}`);
    return this.HttpClient.delete(`${url}`);
  }

  pageCovers(data: any){
    const url = this.CommonService.getFullUrl(pageCoversEndpoints.pageCovers);
    return this.HttpClient.post(`${url}`, data);
  }

  pageCoverDetails(id: string){
    const url = this.CommonService.getFullUrl(pageCoversEndpoints.pageCover + `/${id}`);
    return this.HttpClient.get(`${url}`);
  }
}
