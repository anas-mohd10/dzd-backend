import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { uploadEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  uploadEndpoints = uploadEndpoints

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  uploadThumbnail(data: any) {
    const url = this.CommonService.getFullUrl(this.uploadEndpoints.upload);
    return this.HttpClient.post(`${url}`, data);
  }

  removeThumbnail(data: { location: string }) {
    const url = this.CommonService.getFullUrl(this.uploadEndpoints.delete);
    return this.HttpClient.post(`${url}`, data);
  }
}
