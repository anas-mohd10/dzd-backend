import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { dynamicScriptsEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptsService {
  dynamicScriptsEndpoints = dynamicScriptsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageScript(data: any) {
    const url = this.commonService.getFullUrl(this.dynamicScriptsEndpoints.manage_script);
    return this.http.post(`${url}`, data)
  }

  getScriptDetails() {
    const url = this.commonService.getFullUrl(this.dynamicScriptsEndpoints.script_details);
    return this.http.get(`${url}`)
  }
}
