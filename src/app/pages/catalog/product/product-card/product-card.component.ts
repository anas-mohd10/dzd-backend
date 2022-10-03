import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  productForm: any;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.getProduct()
    this.initForm()
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
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

  onReload() {
    window.location.reload()
  }

  onSubmit() {
  }

}
