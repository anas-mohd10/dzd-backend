import { Injectable } from '@angular/core';
import { internationalisationEndpoints } from 'src/app/config/endpoints';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class InternationalisationService {
  internationalisationEndpoints = internationalisationEndpoints

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createInternationalisation(data: any) {
    const url = this.CommonService.getFullUrl(this.internationalisationEndpoints.createInternationalisation);
    return this.HttpClient.post(`${url}`, data);
  }

  getInternationalisation(lang: string) {
    const url = this.CommonService.getFullUrl(this.internationalisationEndpoints.internationalisation + `/${lang}`);
    return this.HttpClient.get(`${url}`);
  }

  updateInternationalisation(data: any) {
    const url = this.CommonService.getFullUrl(this.internationalisationEndpoints.updateInternationalisation);
    return this.HttpClient.put(`${url}`, data);
  }
}
