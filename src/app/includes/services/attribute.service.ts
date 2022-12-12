import { Injectable } from '@angular/core';
import { attributeEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  attributeEndpoints = attributeEndpoints
  constructor(private http: HttpClient, private commonService: CommonService) { }

  getAttributeByCategory(id: any) {
    const url = this.commonService.getFullUrl(this.attributeEndpoints.attribute_by_category + "?id=" + id);
    return this.http.post(`${url}`, {})
  }

  getAttributeById(id: any, refid: any) {
    const url = this.commonService.getFullUrl(this.attributeEndpoints.attribute_by_id + "?id=" + id + "&refid=" + refid);
    return this.http.post(`${url}`, {})
  }

  updateAttribute(data: any) {
    const url = this.commonService.getFullUrl(this.attributeEndpoints.update_attribute);
    return this.http.put(`${url}`, data)
  }

  deleteAttribute(id: any) {
    const url = this.commonService.getFullUrl(this.attributeEndpoints.delete_attribute_value + "?id=" + id);
    return this.http.post(`${url}`, {})
  }
}
