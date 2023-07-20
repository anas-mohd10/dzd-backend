import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { notificationsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notificationsEndpoints = notificationsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addNotification(data: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.add_notification);
    return this.http.post(`${url}`, data);
  }

  getNotifications() {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.get_notifications);
    return this.http.get(`${url}`);
  }

  getNotificationDetails(query: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.get_notification_details);
    return this.http.post(`${url}`, query);
  }

  searchNotifications(query: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.search_notifications);
    return this.http.post(`${url}`, query);
  }

  updateNotification(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.update_notification + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }

  latestNotifications(data: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.latest_notifications);
    return this.http.post(`${url}`, data);
  }
}
