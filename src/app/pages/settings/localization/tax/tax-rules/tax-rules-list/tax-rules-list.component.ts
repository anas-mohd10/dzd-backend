import { ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { TaxRulesService } from 'src/app/includes/services/tax-rules.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tax-rules',
  templateUrl: './tax-rules-list.component.html',
  styleUrls: ['./tax-rules-list.component.scss'],
})

export class TaxRulesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  taxRulesData: any;
  displayTable: boolean;

  constructor(private taxRulesService: TaxRulesService,
    private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getTaxRules()
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 5,
      processing: true,
    };
  }

  getTaxRules() {
    this.taxRulesService.getTaxRules().subscribe((res: any) => {
      this.taxRulesData = res?.result;
      this.cdr.markForCheck()
      this.dtTrigger.next()
      this.displayTable = true;
    });
  }
}
