import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { menuNavigationEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MenuNavigationService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createMenuNavigation(data: any) {
    const url = this.CommonService.getFullUrl(menuNavigationEndpoints.createMenuNavigation);
    return this.HttpClient.post(url, data);
  }

  getMenuNavigations(deviceQuery: string = '') {
    const url = this.CommonService.getFullUrl(menuNavigationEndpoints.getMenuNavigations + `?device=${deviceQuery}`);
    return this.HttpClient.get(url);
  }

  getMenuNavigation(id: string) { 
    const url = this.CommonService.getFullUrl(menuNavigationEndpoints.getMenuNavigation + '/' + id);
    return this.HttpClient.get(url);
  }

  updateMenuNavigation(id: string, data: any) {
    const url = this.CommonService.getFullUrl(menuNavigationEndpoints.updateMenuNavigation + '/' + id);
    return this.HttpClient.put(url, data);
  }

  deleteMenuNavigation(id: string) {
    const url = this.CommonService.getFullUrl(menuNavigationEndpoints.deleteMenuNavigation + '/' + id);
    return this.HttpClient.delete(url);
  }

  reorderMenuNavigations(data: any) {
    const url = this.CommonService.getFullUrl(menuNavigationEndpoints.reorderMenuNavigations);
    return this.HttpClient.post(url, data);
  }


  copyMenuNavigations() {
    const url = this.CommonService.getFullUrl(menuNavigationEndpoints.copyMenuNavigations);
    return this.HttpClient.put(url, {});
  }
}
