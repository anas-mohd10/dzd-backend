import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { timeSlotEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class TimeslotsService {
  timeSlotEndpoints = timeSlotEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  add(data: any) {
    const url = this.commonService.getFullUrl(this.timeSlotEndpoints.add_slot);
    return this.http.post(`${url}`, data);
  }

  getSlots() {
    const url = this.commonService.getFullUrl(this.timeSlotEndpoints.slots);
    return this.http.get(`${url}`);
  }

  getActiveSlots() {
    const url = this.commonService.getFullUrl(this.timeSlotEndpoints.active_slots);
    return this.http.get(`${url}`);
  }

  getSlotDetails(data: any) {
    const url = this.commonService.getFullUrl(this.timeSlotEndpoints.slot_details);
    return this.http.post(`${url}`, data);
  }

  update(data: any) {
    const url = this.commonService.getFullUrl(this.timeSlotEndpoints.update_slot);
    return this.http.put(`${url}`, data);
  }
}
