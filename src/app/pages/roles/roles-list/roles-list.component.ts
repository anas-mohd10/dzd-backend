import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { RolesService } from 'src/app/includes/services/roles.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  appRoute = appRoutes
  page: number = 1
  limit: number = 30
  totalResults: number = 0
  totalPages: number = 1
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  isLastPage: boolean = false
  roles: Array<any> = [];

  constructor(
    private RolesService: RolesService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getRoles()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getRoles()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.getRoles()
  }

  getRoles() {
    this.RolesService.searchRoles({
      keyword: this.keyword.value,
      isActive: this.isActive.value,
      page: this.page,
      limit: this.limit,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.roles = res?.result?.data
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.isLastPage = res?.result?.isLastPage
          this.ChangeDetectorRef.markForCheck()
        }else{
          
        }
      }, error: (err: any) => {

      }
    })
  }
}
