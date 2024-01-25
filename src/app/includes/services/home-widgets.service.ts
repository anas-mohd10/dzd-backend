import { Injectable } from '@angular/core';
import { homeWidgetEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

interface AddWidget {
  index: number;
  widgetType: string;
  widgetName: string;
}

interface DuplicateWidget {
  widget: string;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeWidgetsService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addHomeWidget(data: AddWidget) {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.addHomeWidget);
    return this.http.post(`${url}`, data)
  }

  updateHomeWidget(data: any) {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.updateHomeWidget);
    return this.http.put(`${url}`, data)
  }

  reorderWidgets(data: any) {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.reorderWidgets);
    return this.http.put(`${url}`, data)
  }

  duplicateHomeWidget(data: DuplicateWidget) {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.duplicateHomeWidget);
    return this.http.post(`${url}`, data)
  }

  homeWidgetDetails(widget: string) {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.homeWidgets + `/${widget}`);
    return this.http.get(`${url}`)
  }

  deleteWidget(widget: string) {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.deleteWidget + `/${widget}`);
    return this.http.delete(`${url}`)
  }

  homeWidgets() {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.homeWidgets);
    return this.http.get(`${url}`)
  }

  getRediections(redirectionType: string, query: string) {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.getRedirections + `/${redirectionType}?keyword=${query}`);
    return this.http.get(`${url}`)
  }

  saveHomeWidgetsDraft(){
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.saveHomeDraft);
    return this.http.post(`${url}`, {})
  }

  publishHomeWidgets(){
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.publishHome);
    return this.http.post(`${url}`, {})
  }
}
