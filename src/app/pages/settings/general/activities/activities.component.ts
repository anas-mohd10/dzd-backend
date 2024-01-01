import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  appRoute = appRoutes
  activities: Array<any> = []
  totalResults: number = 0
  totalPages: number = 1
  page: number = 1
  limit: number = 40
  admin: FormControl = new FormControl('')
  date: any
  todayActivites: Array<any> = []
  yesterdayActivities: Array<any> = []
  admins: Array<any> = []

  constructor(
    private AdminUsersService: AdminUsersService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getActivities()

    this.AdminUsersService.getAdminUsers().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.admins = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.admins = []
        }
      }, error: (err: any) => {
        this.admins = []
      }
    })
  }

  onPageTrigger(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = Number(event.pageSize)
    this.getActivities()
  }

  clearFilters() {
    this.admin.setValue('')
    this.date = null
    this.getActivities()
    this.page = 1
  }

  getActivities() {
    this.AdminUsersService.getActivities({
      page: this.page,
      limit: this.limit,
      admin: this.admin.value,
      date: this.date
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.activities = res?.result?.data
          for (let activity of this.activities) {
            activity.createdAt = new Date(activity.createdAt).toDateString()
          }
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.activities = []
        }
      }, error: (err: any) => {
        this.activities = []
      }
    })
  }

}
