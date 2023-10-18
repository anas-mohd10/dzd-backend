import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { taxClassesEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class TaxClassesService {
  taxClassesEndpoints = taxClassesEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addClass(data: any) {
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.addClass);
    return this.http.post(`${url}`, data);
  }

  getTaxClasses() {
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.getActiveClass);
    return this.http.get(`${url}`);
  }

  searchClass(data: any) {
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.searchClass);
    return this.http.post(`${url}`, data);
  }

  getClassDetails(tax: any) {
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.getClassDetails + `/${tax}`);
    return this.http.get(`${url}`);
  }

  updateClass(data: any) {
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.updateClass);
    return this.http.put(`${url}`, data);
  }

  deleteClass(tax: any) {
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.deleteClass + `/${tax}`);
    return this.http.delete(`${url}`);
  }
}
