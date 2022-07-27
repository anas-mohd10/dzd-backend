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
    const url = this.commonService.getFullUrl(this.rolesEndpoints.add_roles);
    return this.http.post(`${url}`, data)
  }

  getRoles() {
    const url = this.commonService.getFullUrl(this.rolesEndpoints.get_roles);
    return this.http.get(`${url}`)
  }

  getRoleById(slug: any) {
    const url = this.commonService.getFullUrl(this.rolesEndpoints.get_role_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`)
  }

  updateRoles(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.rolesEndpoints.update + "?slug=" + slug);
    return this.http.put(`${url}`, data)
  }
}
