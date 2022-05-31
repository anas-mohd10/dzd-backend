import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-brand',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss'],
})
export class BrandComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  brandData: any;

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.getBrand();
  }

  getBrand() {
    this.brandService.getBrand().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.brandData = res?.result;
          break;
      }
      this.dtTrigger.next();
    });
  }
}
