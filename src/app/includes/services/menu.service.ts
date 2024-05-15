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

  rearrangeMenu(data: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.rearrange_menu);
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


  // Advanced menu for mattressland
  createCsTitle(data: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.createCsTitles);
    return this.http.post(`${url}`, data)
  }

  updateCsTitle(data: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.updateCsTitles);
    return this.http.put(`${url}`, data)
  }

  deleteCsTitle(id: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.deleteCsTitles + `/${id}`);
    return this.http.delete(`${url}`)
  }

  getCsTitleDetails(params: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.getCsDetails + `/${params}`);
    return this.http.get(`${url}`)
  }

  getCsTitles() {
    const url = this.commonService.getFullUrl(this.menuEndpoints.getCsTitles);
    return this.http.get(`${url}`)
  }

  rearrangeCsTitles(data: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.rearrangeCsTitles);
    return this.http.put(`${url}`, data)
  }

  createCsTitleItems(data: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.createCsTitleItems);
    return this.http.post(`${url}`, data)
  }

  updateCsTitleItems(data: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.updateCsTitleItems);
    return this.http.put(`${url}`, data)
  }

  deleteCsTitleItems(id: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.deleteCsTitleItems + `/${id}`);
    return this.http.delete(`${url}`)
  }

  getCsTitleItemDetails(params: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.getCsItemDetails + `/${params}`);
    return this.http.get(`${url}`)
  }

  getCsTitleItems() {
    const url = this.commonService.getFullUrl(this.menuEndpoints.getCsTitleItems);
    return this.http.get(`${url}`)
  }

  rearrangeCsTitleItems(data: any) {
    const url = this.commonService.getFullUrl(this.menuEndpoints.rearrangeCsTitleItems);
    return this.http.put(`${url}`, data)
  }
  // Advanced menu for mattressland=
}
