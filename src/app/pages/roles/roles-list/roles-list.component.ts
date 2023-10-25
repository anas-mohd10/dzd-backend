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
  limit: FormControl = new FormControl('20')
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  isLastPage: boolean = false
  roles: Array<any> = [];
  totalResults: string = ''

  constructor(
    private RolesService: RolesService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getRoles()
  }

  getPreviousPage() {
    this.page -= 1
    this.getRoles()
  }

  getNextPage() {
    this.page += 1
    this.getRoles()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.getRoles()
  }

  getRoles() {
    let payload = {
      keyword: this.keyword.value,
      isActive: this.isActive.value,
      page: this.page,
      limit: this.limit.value,
    }

    this.RolesService.searchRoles(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.roles = res?.result?.data
        this.totalResults = res?.result?.totalResults
        this.isLastPage = res?.result?.isLastPage
        this.page = res?.result?.page
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
