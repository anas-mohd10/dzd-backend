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
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.addNotification);
    return this.http.post(`${url}`, data);
  }

  getNotifications() {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.getNotifications);
    return this.http.get(`${url}`);
  }

  getNotificationDetails(notificationId: string) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.getNotificationDetails + `/${notificationId}`);
    return this.http.get(`${url}`);
  }

  searchNotifications(query: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.searchNotifications);
    return this.http.post(`${url}`, query);
  }

  updateNotification(data: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.updateNotification);
    return this.http.put(`${url}`, data);
  }

  deleteNotification(notificationId: string) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.deleteNotification + `/${notificationId}`);
    return this.http.delete(`${url}`);
  }

  latestOrders() {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.latestOrders);
    return this.http.get(`${url}`);
  }

  moduleNotifications(data: any) {
    const url = this.commonService.getFullUrl(this.notificationsEndpoints.moduleNotifications);
    return this.http.post(`${url}`, data);
  }
}
