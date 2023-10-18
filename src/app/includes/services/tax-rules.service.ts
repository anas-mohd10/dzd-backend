import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { taxRulesEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class TaxRulesService {
  taxRulesEndpoints = taxRulesEndpoints;

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addRule(data: any) {
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.addRule);
    return this.http.post(`${url}`, data);
  }

  getRules() {
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.getRules);
    return this.http.get(`${url}`);
  }

  searchRules(data: any) {
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.searchRules);
    return this.http.post(`${url}`, data);
  }

  getActiveRules() {
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.activeTaxRules);
    return this.http.get(`${url}`);
  }

  getRuleDetails(tax: any) {
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.getRuleDetails + `/${tax}`);
    return this.http.get(`${url}`);
  }

  updateRule(data: any) {
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.updateRule);
    return this.http.put(`${url}`, data);
  }

  deleteRule(tax: any) {
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.deleteRule + `/${tax}`);
    return this.http.delete(`${url}`);
  }
}
