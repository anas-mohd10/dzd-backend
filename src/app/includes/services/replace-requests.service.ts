import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { replaceEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

interface Query {
  page: number;
  limit: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})

export class ReplaceRequestsService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  getReplaceRequests(query: Query) {
    const url = this.commonService.getFullUrl(replaceEndpoints.replaceRequests + `?page=${query.page}&limit=${query.limit}&status=${query.status}`);
    return this.http.get(`${url}`);
  }

  getReplaceDetails(replaceId: string) {
    const url = this.commonService.getFullUrl(replaceEndpoints.replaceDetails + `/${replaceId}`);
    return this.http.get(`${url}`);
  }

  updateReplace(query: any) {
    const url = this.commonService.getFullUrl(replaceEndpoints.updateReplace);
    return this.http.put(`${url}`, query);
  }
}
