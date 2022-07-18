import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../includes/services/product.service';
import { VariantProductService } from 'src/app/includes/services/variant.product.service';

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
  parentProduct: any;
  parentName: any;
  slug: any;
  parentProductId: any;
  parentProductName: any;
  productData: any;

  constructor(
    private route: ActivatedRoute,
    private ProductService: ProductService,
    private variantProductService: VariantProductService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.queryParams.product || '';
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 5,
      processing: true,
    };
    this.getProductBySlug()
  }

  getProductBySlug() {
    this.ProductService.getProductBySlug(this.slug).subscribe((res: any) => {
      this.parentProductName = res?.result[0]?.name
      this.parentProductId = res?.result[0]._id;
      this.variantProductService.getVariantProductByParent(this.parentProductId).subscribe((res: any) => {
        this.productData = res?.result;
        this.displayTable = true
      });
    });
  }
}
