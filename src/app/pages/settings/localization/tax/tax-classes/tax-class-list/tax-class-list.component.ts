import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
// import { Subject } from 'rxjs';

@Component({
  selector: 'app-tax-class',
  templateUrl: './tax-class-list.component.html',
  styleUrls: ['./tax-class-list.component.scss'],
})
export class TaxClassComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  // public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  taxClassData: any;
  displayTable: boolean;

  constructor(private taxClassService: TaxClassesService) {}

  ngOnInit(): void {
    this.getTaxClasses()
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 5,
      processing: true,
    };
  }

  getTaxClasses() {
    this.taxClassService.getTaxClasses().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.taxClassData = res?.result;
          break;
      }
      // this.dtTrigger.next()
      this.displayTable = true;
    });
  }
}
