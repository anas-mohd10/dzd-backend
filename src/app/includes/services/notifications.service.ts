import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { notificationsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notificationsEndpoints = notificationsEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addNotification(data: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.add_notification);
    return this.http.post(`${url}`, data);
  }

  getNotifications() {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.get_notifications);
    return this.http.get(`${url}`);
  }

  getNotificationsByPage(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.get_notification_page + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`);
  }

  getNotificationsCount() {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.get_notification_count);
    return this.http.get(`${url}`);
  }

  getSentNotificationsCount() {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.get_sent_notification_count);
    return this.http.get(`${url}`);
  }

  getPendingNotificationsCount() {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.get_pending_notification_count);
    return this.http.get(`${url}`);
  }

  searchNotifications(query: any, page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.search_notifications + "?page=" + page + "&limit=" + limit);
    return this.http.post(`${url}`, query);
  }

  getNotificationBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.get_notification + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateNotification(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.update_notification + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
