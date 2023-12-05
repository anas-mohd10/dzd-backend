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
  lastPage: boolean = true
  page: number = 1
  admin: FormControl = new FormControl('')
  date: any
  todayActivites: Array<any> = []
  yesterdayActivities: Array<any> = []
  admins: Array<any> = []
  totalPages: number = 1

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

  navBack() {
    this.page--
    this.getActivities()
  }

  navNext() {
    this.page++
    this.getActivities()
  }

  clearFilters() {
    this.admin.setValue('')
    this.date = null
    this.getActivities()
    this.page = 1
  }

  getActivities() {
    this.AdminUsersService.getActivities({ page: this.page, admin: this.admin.value, date: this.date }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.activities = res?.result?.data
          for (let activity of this.activities) {
            activity.createdAt = new Date(activity.createdAt).toDateString()
          }
          this.totalPages = res?.result?.totalPages
          this.lastPage = res?.result?.lastPage
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
