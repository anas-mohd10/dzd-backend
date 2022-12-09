 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { taxRulesEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class TaxRulesService {
    taxRulesEndpoints = taxRulesEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  addTaxRules(data: any) {
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.add_tax_rules);
    return this.http.post(`${url}`, data);
  }

  getTaxRules(){
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.get_tax_rules);
    return this.http.get(`${url}`);
  }

  getActiveTaxRules(){
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.get_active_tax_rules);
    return this.http.get(`${url}`);
  }

  getTaxRulesBySlug(slug: any){
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.get_tax_rules_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateTaxRules(slug: any, data: any){
    const url = this.commonService.getFullUrl(this.taxRulesEndpoints.update_tax_rules + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
