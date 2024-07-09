import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { productDesignsEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProductDesignsService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  manageProductDesigns(data: any) {
    const url = this.CommonService.getFullUrl(productDesignsEndpoints.manageProductDesigns);
    return this.HttpClient.post(`${url}`, data);
  }

  getProductDesigns() {
    const url = this.CommonService.getFullUrl(productDesignsEndpoints.productdesigns);
    return this.HttpClient.get(`${url}`);
  }
}
