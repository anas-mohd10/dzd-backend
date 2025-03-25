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

  getCarts(data: any) {
    const url = this.commonService.getFullUrl(this.cartEndpoints.get_cart);
    return this.http.post(`${url}`, data)
  }

  getCartCalculation(cartData: any) {
    const url = this.commonService.getFullUrl(this.cartEndpoints.cartCalculation);
    return this.http.post(`${url}`, cartData)
  }

  sendCartNotification(data: any) {
    const url = this.commonService.getFullUrl(this.cartEndpoints.cart_notification);
    return this.http.post(`${url}`, data)
  }

  getCartProducts(data: any) {
    const url = this.commonService.getFullUrl(this.cartEndpoints.cartProducts);
    return this.http.post(`${url}`, data)
  }
}
