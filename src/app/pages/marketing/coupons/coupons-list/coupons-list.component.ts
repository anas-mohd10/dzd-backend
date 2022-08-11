import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes
  couponsData: any;
  displayTable: boolean;
  constructor(
    private collectionService: CollectionService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private couponService: CouponsService
  ) { }

  ngOnInit(): void {
    this.getCoupons()
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
  }

  getCoupons() {
    this.couponService.getCoupons().subscribe((res: any) => {
      console.log(res?.result);
      this.couponsData = res?.result
      for (let i = 0; i < this.couponsData.length; i++) {
        this.couponsData[i].fromDate = new Date(
          this.couponsData[i].fromDate
        ).toDateString();
      }
      for (let i = 0; i < this.couponsData.length; i++) {
        this.couponsData[i].lastDate = new Date(
          this.couponsData[i].lastDate
        ).toDateString();
      }
      this.dtTrigger.next();
      this.displayTable = true;
    })
  }

}
