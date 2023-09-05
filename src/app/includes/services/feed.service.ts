import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { feedEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  feedEndpoints = feedEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageFeed(data: any) {
    const url = this.commonService.getFullUrl(this.feedEndpoints.manage_feed);
    return this.http.post(`${url}`, data)
  }

  getFeedDetails() {
    const url = this.commonService.getFullUrl(this.feedEndpoints.feed_details);
    return this.http.get(`${url}`)
  }
}
