import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { adminUsersEndpoints } from 'src/app/config/endpoints/admin.users.endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  adminUsersEndpoints = adminUsersEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  getAdminUsers() {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.get_admin_users);
    return this.http.get(`${url}`)
  }

  getAdminUser(slug: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.get_admin_user + "?adminId=" + slug);
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
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.addAdmin);
    return this.http.post(`${url}`, data)
  }

  updateAdminDetails(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.updateAdmin);
    return this.http.put(`${url}`, data)
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
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.subscribeAdmin);
    return this.http.post(`${url}`, data)
  }

  resetAdminPassword(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.reset_admin_password);
    return this.http.post(`${url}`, data)
  }

  forgotPassword(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.forgotPassword);
    return this.http.post(`${url}`, data)
  }

  resetPassword(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.resetPassword);
    return this.http.post(`${url}`, data)
  }

  resetToken(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.resetToken);
    return this.http.post(`${url}`, data)
  }

  getDuplicateEmail(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.duplicateEmail);
    return this.http.post(`${url}`, data)
  }

  deleteAdmin(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.deleteAdmin);
    return this.http.post(`${url}`, data)
  }

  updateAdminEmail(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.updateAdminEmail);
    return this.http.put(`${url}`, data)
  }

  updateAdminMobile(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.updateAdminMobile);
    return this.http.put(`${url}`, data)
  }

  changePassword(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.changePassword);
    return this.http.put(`${url}`, data)
  }

  getActivities(data: any) {
    const url = this.commonService.getFullUrl(this.adminUsersEndpoints.getActivities);
    return this.http.post(`${url}`, data)
  }
}


