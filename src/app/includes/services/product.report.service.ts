import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { productReportEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductReportService {
  productReportEndpoints = productReportEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getProductReport() { 
    
  }
}
