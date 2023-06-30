import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rolesEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  rolesEndpoints = rolesEndpoints
  constructor(private http: HttpClient, private commonService: CommonService) { }

  addRoles(data: any) {
    const url = this.commonService.getFullUrl(this.rolesEndpoints.add_role);
    return this.http.post(`${url}`, data)
  }

  getRoles() {
    const url = this.commonService.getFullUrl(this.rolesEndpoints.get_roles);
    return this.http.get(`${url}`)
  }

  getActiveRoles() {
    const url = this.commonService.getFullUrl(this.rolesEndpoints.active_roles);
    return this.http.get(`${url}`)
  }

  searchRoles(data: any) {
    const url = this.commonService.getFullUrl(this.rolesEndpoints.search_role);
    return this.http.post(`${url}`, data)
  }

  getRoleDetails(data: any) {
    const url = this.commonService.getFullUrl(this.rolesEndpoints.get_role_details);
    return this.http.post(`${url}`, data)
  }

  updateRoles(data: any) {
    const url = this.commonService.getFullUrl(this.rolesEndpoints.update_role);
    return this.http.put(`${url}`, data)
  }
}
