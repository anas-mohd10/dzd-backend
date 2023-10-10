import { Injectable } from '@angular/core';
import { attributeEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  attributeEndpoints = attributeEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  getAttributes(category: any) {
    const url = this.commonService.getFullUrl(this.attributeEndpoints.getAttributes + "?category=" + category);
    return this.http.post(`${url}`, {})
  }

  getAttributeDetails(category: string, attribute: string) {
    const url = this.commonService.getFullUrl(this.attributeEndpoints.attributeDetails + "?category=" + category + "&attribute=" + attribute);
    return this.http.post(`${url}`, {})
  }

  updateAttribute(data: any) {
    const url = this.commonService.getFullUrl(this.attributeEndpoints.updateAttribute);
    return this.http.put(`${url}`, data)
  }

  createAttribute(data: any) {
    const url = this.commonService.getFullUrl(this.attributeEndpoints.createAttribute);
    return this.http.post(`${url}`, data)
  }

  deleteAttribute(id: any) {
    const url = this.commonService.getFullUrl(this.attributeEndpoints.delete_attribute_value + "?id=" + id);
    return this.http.post(`${url}`, {})
  }
}
