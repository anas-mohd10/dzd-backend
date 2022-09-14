import { cartEndpoints } from './../../config/endpoints/cart.endpoints';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartEndpoints = cartEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getCarts() {
    const url = this.commonService.getFullUrl(this.cartEndpoints.get_cart);
    return this.http.get(`${url}`)
  }
}
