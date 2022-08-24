import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { ProductReportService } from 'src/app/includes/services/product.report.service';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-product-report-list',
  templateUrl: './product-report-list.component.html',
  styleUrls: ['./product-report-list.component.scss']
})
export class ProductReportListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  productReportForm: FormGroup
  appRoute = appRoutes
  productsData: any;
  productsReportsData: any;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private productReportService: ProductReportService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getProducts()
    this.getProductReports()
  }

  initForm() {
    this.productReportForm = this.formBuilder.group({
      fromDate: [''],
      toDate: [''],
      product: [''],
    });
  }
  
  getProducts() {
    this.productService.getProduct().subscribe((res: any) => {
      this.productsData = res?.result
    })
  }

  getProductReports() {
    this.productReportService.getProductReport().subscribe((res: any) => {
      this.productsReportsData = res?.result
      for (let data of this.productsReportsData) {
        data.orders.orderDate = new Date(data.orders.orderDate).toDateString()
        for (let product of data?.orders?.product) {
          console.log(product);
        }
      }
    })
  }

  checkToDate() { }

  reloadPage() {
    window.location.reload()
  }

  onSubmit() { }

}
