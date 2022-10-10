import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { collectionEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  collectionEndpoints = collectionEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addCollection(data: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.add_collection);
    return this.http.post(`${url}`, data);
  }

  getCollection() {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.get_collection);
    return this.http.get(`${url}`);
  }

  getCollectionPage(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.get_collection_page + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`);
  }


  getCollectionBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.get_collection_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  searchCollection(query: any, page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.search_collection + "?page=" + page + "&limit=" + limit);
    return this.http.post(`${url}`, query);
  }

  getCollectionCount() {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.get_collection_count);
    return this.http.get(`${url}`);
  }

  updateCollection(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.update_collection + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
