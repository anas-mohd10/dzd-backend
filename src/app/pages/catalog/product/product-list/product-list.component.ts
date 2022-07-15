import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-product',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};

  appRoute = appRoutes;
  productData: any;
  displayTable: boolean;
  categoryData: any;

  constructor(
    private ProductService: ProductService,
  ) {}

  ngOnInit(): void {
    this.getProduct();
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 5,
      processing: true,
    };
  }

  getProduct() {
    this.ProductService.getProduct().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.productData = res?.result;
          break;
      }
      this.displayTable = true;
    });
  }
}
