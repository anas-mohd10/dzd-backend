import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { offerEndpoints } from '../../config/endpoints';

@Injectable({ providedIn: 'root' })

export class OfferService {
  offerEndpoints = offerEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addOffer(data: any) {
    const url = this.commonService.getFullUrl(this.offerEndpoints.add_offer);
    return this.http.post(`${url}`, data);
  }

  getOffer(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.offerEndpoints.get_offer + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`);
  }

  getOfferById(id: any) {
    const url = this.commonService.getFullUrl(this.offerEndpoints.get_offer_by_id + "?slug=" + id);
    return this.http.get(`${url}`);
  }

  getActiveOffer() {
    const url = this.commonService.getFullUrl(this.offerEndpoints.get_active_offer);
    return this.http.get(`${url}`);
  }

  updateOffer(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.offerEndpoints.update_offer + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }

  searchOffer(query: any, page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.offerEndpoints.search_offer + "?page=" + page + "&limit=" + limit);
    return this.http.post(`${url}`, query);
  }

  getOfferCount() {
    const url = this.commonService.getFullUrl(this.offerEndpoints.get_offer_count);
    return this.http.get(`${url}`);
  }
}
