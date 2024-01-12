import { Injectable } from '@angular/core';
import { homeWidgetEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

interface AddWidget {
  index: number;
  widgetType: string;
}

interface DuplicateWidget{
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
    return this.http.post(`${url}`, data)
  }

  duplicateHomeWidget(data: DuplicateWidget) {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.duplicateHomeWidget);
    return this.http.post(`${url}`, data)
  }

  homeWidgetDetails(widget: string) {
    const url = this.commonService.getFullUrl(homeWidgetEndpoints.homeWidgetDetails + `/${widget}`);
    return this.http.get(`${url}`)
  }
}
