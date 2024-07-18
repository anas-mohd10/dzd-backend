import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { megaMenuEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MegamenuService {
  megaMenuEndpoints = megaMenuEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addMegaMenu(data: any) {
    const url = this.commonService.getFullUrl(this.megaMenuEndpoints.addMegaMenu);
    return this.http.post(`${url}`, data)
  }

  rearrangeMegaMenu(data: any) {
    const url = this.commonService.getFullUrl(this.megaMenuEndpoints.rearrangeMegaMenu);
    return this.http.post(`${url}`, data)
  }

  updateMegaMenu(data: any) {
    const url = this.commonService.getFullUrl(this.megaMenuEndpoints.updateMegaMenu);
    return this.http.put(`${url}`, data)
  }

  getMegaMenuItems() {
    const url = this.commonService.getFullUrl(this.megaMenuEndpoints.megaMenuItems);
    return this.http.get(`${url}`)
  }

  getMegaMenuDetails(menuId: any) {
    const url = this.commonService.getFullUrl(this.megaMenuEndpoints.megaMenuDetails + `/${menuId}`);
    return this.http.get(`${url}`)
  }

  deleteMegaMenu(menuId: string){
    const url = this.commonService.getFullUrl(this.megaMenuEndpoints.deleteMegaMenu + `/${menuId}`);
    return this.http.delete(`${url}`)
  }
}
