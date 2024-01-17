import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catalogEndpoints } from '../../config/endpoints';

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

  getCatalogs() {
    const url = this.commonService.getFullUrl(catalogEndpoints.getCatalogs);
    return this.http.get(`${url}`);
  }

  getCatalogDetails(catalog: string) {
    const url = this.commonService.getFullUrl(catalogEndpoints.getCatalogs + `/${catalog}`);
    return this.http.get(`${url}`);
  }
}
