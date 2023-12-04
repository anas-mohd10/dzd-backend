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
  lastPage: boolean = false
  page: number = 1
  admin: FormControl = new FormControl('')
  date: FormControl = new FormControl('')

  constructor(
    private AdminUsersService: AdminUsersService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getActivities()
  }

  getActivities() {
    this.AdminUsersService.getActivities({ page: this.page, admin: this.admin.value, date: this.date.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.activities = res?.result?.data
          for (let activity of this.activities) activity.createdAt = new Date(activity.createdAt).toDateString()
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
