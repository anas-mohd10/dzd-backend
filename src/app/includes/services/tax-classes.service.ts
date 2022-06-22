import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { taxClassesEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class TaxClassesService {
taxClassesEndpoints = taxClassesEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  addTaxClasses(data: any) {
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.add_tax_classes);
    return this.http.post(`${url}`, data);
  }

  getTaxClasses(){
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.get_tax_classes);
    return this.http.get(`${url}`);
  }

  getTaxClassesBySlug(slug: any){
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.get_tax_classes_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateTaxClasses(slug: any, data: any){
    const url = this.commonService.getFullUrl(this.taxClassesEndpoints.update_tax_classes + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
