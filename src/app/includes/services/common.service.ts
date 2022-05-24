import {Injectable} from '@angular/core';
import {config} from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  apiUrl = config.apiBaseUrl;
  baseUrl = config.baseUrl;

  constructor() {
  }

  getFullUrl(endPoint: any) {
    return `${this.apiUrl}${endPoint}`;
  }

  getDownloadUrl(endPoint: any) {
    return `${this.baseUrl}/${endPoint}`;
  }
}