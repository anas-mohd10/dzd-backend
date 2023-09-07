import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { menuEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuEndpoints = menuEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addMenu(data: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.add_menu);
    return this.http.post(`${url}`, data)
  }

  updateMenu(data: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.update_menu);
    return this.http.put(`${url}`, data)
  }

  getMenuItems(query: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.get_menu + `?type=${query}`);
    return this.http.get(`${url}`)
  }

  getMenuDetails(params: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.get_menu_details + `/${params}`);
    return this.http.get(`${url}`)
  }
}
