import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { collectionEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  collectionEndpoints = collectionEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  addCollection(data: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.add_collection);
    return this.http.post(`${url}`, data);
  }

  getCollection() {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.get_collection);
    return this.http.get(`${url}`);
  }
}
