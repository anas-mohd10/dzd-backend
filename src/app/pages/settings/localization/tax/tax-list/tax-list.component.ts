import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
// import { BrandService } from '../../../../includes/services/brand.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tax',
  templateUrl: './tax-list.component.html',
  styleUrls: ['./tax-list.component.scss'],
})
export class TaxComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  brandData: any;

  constructor() {}

  ngOnInit(): void {
  }
}
