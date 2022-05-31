import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { attributeEndpoints } from 'src/app/config/endpoints/attribute.endpoints';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  attributeEndpoints = attributeEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  getCategoryById(id: string) {
    const url = this.commonService.getFullUrl(
      this.attributeEndpoints.get_attribute_by_category + '/' + id
    );
    return this.http.get(`${url}`);
  }
}
