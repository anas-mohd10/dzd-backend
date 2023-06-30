import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { appRoutes } from "../../../../config/routes/app.routes"
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  appRoute = appRoutes
  page: number = 1
  limit: FormControl = new FormControl('20')
  lastPage: boolean = false
  users: Array<any> = []

  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')

  constructor(
    private AdminUsersService: AdminUsersService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAdminUsers()
  }

  getPreviousPage() {
    this.page -= 1
    this.getAdminUsers()
  }

  getNextPage() {
    this.page += 1
    this.getAdminUsers()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.getAdminUsers()
  }

  getAdminUsers() {
    let payload = {
      keyword: this.keyword.value,
      isActive: this.isActive.value,
      page: this.page,
      limit: this.limit.value
    }

    this.AdminUsersService.searchAdmins(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.users = res?.result?.data
        this.lastPage = res?.result?.lastPage
        this.page = res?.result?.page
        this.ChangeDetectorRef.detectChanges()
      }
    })
  }

}
