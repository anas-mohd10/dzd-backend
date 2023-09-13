import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { adminUsersEndpoints } from 'src/app/config/endpoints/admin.users.endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  adminUsersEndpoints = adminUsersEndpoints
  constructor(private http: HttpClient, private commonService: CommonService) { }

  getAdminUsers() {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.get_admin_users);
    return this.http.get(`${url}`)
  }

  getAdminUser(slug: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.get_admin_user + "?slug=" + slug);
    return this.http.get(`${url}`)
  }

  getAdminUserByMail(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.get_admin_count);
    return this.http.post(`${url}`, data)
  }

  getAdminDetails(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.admin_details);
    return this.http.post(`${url}`, data)
  }

  addAdminUsers(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.register_admin);
    return this.http.post(`${url}`, data)
  }

  updateAdminUser(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.update_admin);
    return this.http.put(`${url}`, data)
  }

  searchAdmins(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.search_admins);
    return this.http.post(`${url}`, data)
  }

  generalSearch(data: any, query: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.general_seearch + `?type=${query}`);
    return this.http.post(`${url}`, data)
  }

  subscribeAdmin(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.subscribe_admin);
    return this.http.post(`${url}`, data)
  }

  resetPassword(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.reset_admin_password);
    return this.http.post(`${url}`, data)
  }
}


