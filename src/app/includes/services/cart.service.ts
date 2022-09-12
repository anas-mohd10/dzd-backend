import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';;


@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private commonService: CommonService) { }
}
