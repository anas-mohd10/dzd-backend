import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  // public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  productData: any;
  displayTable: boolean;

  constructor(private productService: ProductService) {}

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
    this.productService.getProduct().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.productData = res?.result;
          console.log(this.productData)
          break;
      }
      // this.dtTrigger.next();
      this.displayTable = true;
    });
  }
}
