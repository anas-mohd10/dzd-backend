import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { ReturnsService } from 'src/app/includes/services/returns.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-returns-list',
  templateUrl: './returns-list.component.html',
  styleUrls: ['./returns-list.component.scss']
})
export class ReturnsListComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes
  returnsData: any

  constructor(
    private returnsService: ReturnsService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.getReturnsList()
  }

  getReturnsList() {
    this.returnsService.getReturnLists().subscribe((res: any) => {
      this.returnsData = res?.result
    })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
