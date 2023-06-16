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

  addCollectionSku(data: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.add_collection_sku);
    return this.http.post(`${url}`, data);
  }

  getCollection() {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.get_collection);
    return this.http.get(`${url}`);
  }

  getActiveCollection() {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.get_active_collections);
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

  searchCollection(query: any, page: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.search_collection + "?page=" + page);
    return this.http.post(`${url}`, query);
  }

  getCollectionCount() {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.get_collection_count);
    return this.http.get(`${url}`);
  }

  updateCollection(data: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.update_collection);
    return this.http.put(`${url}`, data);
  }

  archiveCollection(data: any, page: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.archive_collection + "?page=" + page);
    return this.http.post(`${url}`, data);
  }

  restoreCollection(data: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.restore_collection);
    return this.http.post(`${url}`, data);
  }

  collectionImages(data: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.collection_images);
    return this.http.post(`${url}`, data);
  }

  bulkFileUpload(data: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.collection_bulk_file_upload);
    return this.http.post(`${url}`, data);
  }

  bulkMediaUpload(data: any) {
    const url = this.commonService.getFullUrl(this.collectionEndpoints.collection_bulk_image_upload);
    return this.http.post(`${url}`, data);
  }
}
