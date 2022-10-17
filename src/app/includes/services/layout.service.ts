import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { layoutEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  layoutEndpoints = layoutEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addLayout(data: any) {
    const url = this.commonService.getFullUrl(this.layoutEndpoints.add_layout);
    return this.http.post(`${url}`, data);
  }

  getLayouts() {
    const url = this.commonService.getFullUrl(this.layoutEndpoints.get_layouts);
    return this.http.get(`${url}`);
  }

  getLayoutByPage(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.layoutEndpoints.get_layout_page + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`);
  }

  getLayoutsCount() {
    const url = this.commonService.getFullUrl(this.layoutEndpoints.get_layouts_count);
    return this.http.get(`${url}`);
  }

  getLayoutBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.layoutEndpoints.get_layout + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateLayout(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.layoutEndpoints.update_layout + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
