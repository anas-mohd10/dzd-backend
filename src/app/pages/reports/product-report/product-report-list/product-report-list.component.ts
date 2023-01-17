import { ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { ProductReportService } from 'src/app/includes/services/product.report.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { CsvService } from 'src/app/includes/services/csv.service';

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
  products: any;
  productsReportsData: any;
  headers: any[] = ['Product', 'Price', 'Order', 'Date', 'Quantity', 'Customer', 'Payment', 'Total']
  name: String = "product_report" + Date.now()

  product: any

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private productReportService: ProductReportService,
    private csvService: CsvService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };

    this.productReportForm = this.formBuilder.group({
      from: [''],
      to: [''],
    });

    this.productService.getProduct().subscribe((res: any) => {
      this.products = res?.result
      this.cdr.markForCheck()
    })

    this.productReportService.getProductReport().subscribe((res: any) => {
      this.productsReportsData = res?.result
      this.cdr.markForCheck()
      this.dtTrigger.next()
    })
  }

  filterReport(){}

  clearFilters(){}

  downloadCsvFile() {
    this.csvService.csvDownload(this.headers, this.productsReportsData, this.name)
  }

}
