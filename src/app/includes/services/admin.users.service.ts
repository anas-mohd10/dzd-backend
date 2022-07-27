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

  addAdminUsers() { }

  updateAdminUsers() { }
}
