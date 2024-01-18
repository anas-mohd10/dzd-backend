import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catalogEndpoints, catalogWidgetEndpoints } from '../../config/endpoints';

interface AddWidget {
  index: number;
  widgetType: string;
  widgetName: string;
  catalog: string;
}

interface DuplicateWidget {
  widget: string;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  createCatalog(data: any) {
    const url = this.commonService.getFullUrl(catalogEndpoints.createCatalog);
    return this.http.post(`${url}`, data);
  }

  updateCatalog(data: any, catalog: string) {
    const url = this.commonService.getFullUrl(catalogEndpoints.updateCatalog + `/${catalog}`);
    return this.http.put(`${url}`, data);
  }

  deleteCatalog(catalog: string) {
    const url = this.commonService.getFullUrl(catalogEndpoints.deleteCatalog + `/${catalog}`);
    return this.http.delete(`${url}`);
  }

  getCatalogs() {
    const url = this.commonService.getFullUrl(catalogEndpoints.getCatalogs);
    return this.http.get(`${url}`);
  }

  getCatalogDetails(catalog: string) {
    const url = this.commonService.getFullUrl(catalogEndpoints.getCatalogs + `/${catalog}`);
    return this.http.get(`${url}`);
  }

  addCatalogWidget(data: AddWidget) {
    const url = this.commonService.getFullUrl(catalogWidgetEndpoints.addCatalogWidget);
    return this.http.post(`${url}`, data)
  }

  updateCatalogWidget(data: any) {
    const url = this.commonService.getFullUrl(catalogWidgetEndpoints.updateCatalogWidget);
    return this.http.put(`${url}`, data)
  }

  reorderWidgets(data: any) {
    const url = this.commonService.getFullUrl(catalogWidgetEndpoints.reorderWidgets);
    return this.http.put(`${url}`, data)
  }

  duplicateCatalogWidget(data: DuplicateWidget) {
    const url = this.commonService.getFullUrl(catalogWidgetEndpoints.duplicateCatalogWidget);
    return this.http.post(`${url}`, data)
  }

  catalogWidgetDetails(widget: string) {
    const url = this.commonService.getFullUrl(catalogWidgetEndpoints.catalogWidgets + `/${widget}`);
    return this.http.get(`${url}`)
  }

  deleteWidget(widget: string) {
    const url = this.commonService.getFullUrl(catalogWidgetEndpoints.deleteCatalogWidget + `/${widget}`);
    return this.http.delete(`${url}`)
  }

  catalogWidgets() {
    const url = this.commonService.getFullUrl(catalogWidgetEndpoints.catalogWidgets);
    return this.http.get(`${url}`)
  }

}
