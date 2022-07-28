import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { appRoutes } from "../../../../config/routes/app.routes"
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  adminUsersData: any;
  displayTable: boolean = false;

  constructor(
    private adminService: AdminUsersService
  ) { }

  ngOnInit(): void {
    this.getAdminUsers()
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
  }

  getAdminUsers() {
    this.adminService.getAdminUsers().subscribe((res: any) => {
      this.adminUsersData = res?.result
      this.displayTable = true
      this.dtTrigger.next();
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
