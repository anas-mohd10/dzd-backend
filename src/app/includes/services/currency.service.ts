import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { currencyEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  currencyDetails() {
    const url = this.CommonService.getFullUrl(currencyEndpoints.currencyDetails);
    return this.HttpClient.get(`${url}`);
  }

  createCurrencyDetails(currencyDoc: any) {
    const url = this.CommonService.getFullUrl(currencyEndpoints.createCurrencyDetails);
    return this.HttpClient.post(`${url}`, currencyDoc);
  }

  updateCurrencyDetails(paramsId: string, currencyDoc: any) {
    const url = this.CommonService.getFullUrl(currencyEndpoints.updateCurrencyDetails + `/${paramsId}`);
    return this.HttpClient.put(`${url}`, currencyDoc);
  }
}
