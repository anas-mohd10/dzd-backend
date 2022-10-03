import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  appRoute = appRoutes;
  productData: any;
  base: any

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.getProduct()
  }


  getProduct() {
    this.productService.getProduct().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.productData = res?.result;
          break;
      }
    });
  }

}
