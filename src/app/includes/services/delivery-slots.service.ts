import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { deliverySlots } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class DeliverySlotsService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addSlot(data: any) {
    const url = this.commonService.getFullUrl(deliverySlots.add);
    return this.http.post(`${url}`, data)
  }

  getSlots(day: string) {
    const url = this.commonService.getFullUrl(deliverySlots.get + "?day=" + day);
    return this.http.get(`${url}`)
  }

  getDeliverySlots(type?: string, day?: string) {
    const url = this.commonService.getFullUrl(deliverySlots.get + `?type=${type ? type : ''}&day=${day ? day : ''}`);
    return this.http.get(`${url}`)
  }

  getSlotDetails(data: string) {
    const url = this.commonService.getFullUrl(deliverySlots.get);
    return this.http.get(`${url}/${data}`)
  }

  getSlotDetailsPerDay(data: string) {
    const url = this.commonService.getFullUrl(deliverySlots.deliverySlots);
    return this.http.get(`${url}/${data}`)
  }

  activeSlots() {
    const url = this.commonService.getFullUrl(deliverySlots.get + "?type=active");
    return this.http.get(`${url}`)
  }

  inactiveSlots() {
    const url = this.commonService.getFullUrl(deliverySlots.get + "?type=inactive");
    return this.http.get(`${url}`)
  }

  updateSlot(data: any) {
    const url = this.commonService.getFullUrl(deliverySlots.update);
    return this.http.put(`${url}`, data)
  }

  updateSlots(data: any) {
    const url = this.commonService.getFullUrl(deliverySlots.updateDeliverySlots);
    return this.http.put(`${url}`, data)
  }

  deleteSlot(data: string) {
    const url = this.commonService.getFullUrl(deliverySlots.delete);
    return this.http.delete(`${url}/${data}`)
  }
}
