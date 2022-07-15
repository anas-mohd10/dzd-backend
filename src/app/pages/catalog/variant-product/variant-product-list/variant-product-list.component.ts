import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../includes/services/product.service';

@Component({
  selector: 'app-variant-product-list',
  templateUrl: './variant-product-list.component.html',
  styleUrls: ['./variant-product-list.component.scss'],
})
export class VariantProductListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};

  appRoute = appRoutes;
  displayTable: boolean;
  productSlug: any;
  parentProduct: any;
  parentName: any;

  constructor(
    private route: ActivatedRoute,
    private ProductService: ProductService
  ) {}

  ngOnInit(): void {
    this.productSlug = this.route.snapshot.queryParams.product || '';
    this.getParentProduct();
    this.getVariantProducts();
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 5,
      processing: true,
    };
  }

  getParentProduct() {
    this.ProductService.getProductBySlug(this.productSlug).subscribe(
      (res: any) => {
        this.parentProduct = res?.result[0];
      }
    );
  }

  getVariantProducts() {
    this.displayTable = true
  }
}
