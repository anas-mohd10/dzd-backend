import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { permissionsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  permissionsEndpoint = permissionsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  getPermissions() {
    const url = this.commonService.getFullUrl(this.permissionsEndpoint.getPermissions);
    return this.http.get(`${url}`);
  }
}
