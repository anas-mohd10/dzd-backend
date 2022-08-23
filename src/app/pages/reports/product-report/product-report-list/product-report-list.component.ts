import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes/app.routes';
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
  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
  }

  getProducts(){
    
  }

  checkToDate() { }

  reloadPage() { }

  onSubmit() { }

}
