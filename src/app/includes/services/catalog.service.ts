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
}
