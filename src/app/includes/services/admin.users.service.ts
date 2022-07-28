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

  getAdminUserByMail(email: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.get_admin_count + "?email=" + email);
    return this.http.get(`${url}`)
  }

  addAdminUsers(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.register_admin);
    return this.http.post(`${url}`, data)
  }

  updateAdminUser(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.update_admin + "?id=" + slug);
    return this.http.put(`${url}`, data)
  }
}
