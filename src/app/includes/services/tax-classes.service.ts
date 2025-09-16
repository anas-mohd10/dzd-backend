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
    const url = this.commonService.getFullUrl(`${this.taxClassesEndpoints.getClass}/active`);
    return this.http.get(`${url}`);
  }

  searchClass(data: any) {
    const url = this.commonService.getFullUrl(`${this.taxClassesEndpoints.getClass}/search`)
    return this.http.post(`${url}`,data)
  }

  updateClass(data: any) {
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.updateClass);
    return this.http.put(`${url}`, data);
  }

  deleteClass(tax: any) {
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.deleteClass + `/${tax}`);
    return this.http.delete(`${url}`);
  }
  getClassDetails(tax: any){
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.getClass + `/${tax}`);
    return this.http.delete(`${url}`);
  }
}
