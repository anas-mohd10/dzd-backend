import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes';
import { LayoutService } from 'src/app/includes/services/layout.service';

@Component({
  selector: 'app-layout-list',
  templateUrl: './layout-list.component.html',
  styleUrls: ['./layout-list.component.scss']
})
export class LayoutListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement!: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  displayTable: boolean;
  layoutsData: any;

  constructor(
    private layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    }
    this.getLayouts()
  }

  getLayouts() {
    this.layoutService.getLayouts().subscribe((res: any) => {
      this.layoutsData = res?.result
      this.displayTable = true
      this.dtTrigger.next('')
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
