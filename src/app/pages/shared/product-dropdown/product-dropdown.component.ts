import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ProductService } from 'src/app/includes/services/product.service';

interface BrandProps {
  name: string,
  slug: string,
  _id: string,
  thumbnail: string
}

@Component({
  selector: 'app-product-dropdown',
  templateUrl: './product-dropdown.component.html',
  styleUrls: ['./product-dropdown.component.scss']
})
export class ProductDropdownComponent implements OnInit, OnChanges {
  products: Array<BrandProps> = [];
  productDetails: BrandProps;
  @Input('productDetails') product?: BrandProps;
  @Output() productTrigered = new EventEmitter<any>();
  searchKeyword: FormControl = new FormControl('', Validators.required)

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      this.productDetails = this.product;
      this.searchKeyword.setValue(this.product.name);
    }
  }

  getProducts() {
    if (!this.searchKeyword.valid) {
      this.products = []
      return;
    }

    this.ProductService.dropdownProducts(this.searchKeyword.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.products = res.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    })
  }

  productClicked(brand: BrandProps) {
    this.productTrigered.emit(brand);
    this.productDetails = brand;
    this.searchKeyword.setValue(brand.name);
    this.products = [];
  }

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ProductService: ProductService,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
  }

}
