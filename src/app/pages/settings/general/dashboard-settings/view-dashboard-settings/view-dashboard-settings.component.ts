import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { HomeSettingsService } from 'src/app/includes/services/home.settings.service';

@Component({
  selector: 'app-view-dashboard-settings',
  templateUrl: './view-dashboard-settings.component.html',
  styleUrls: ['./view-dashboard-settings.component.scss']
})
export class ViewDashboardSettingsComponent implements OnInit {

  appRoute = appRoutes
  dashboardSettingsCount: any = 0
  slug: any
  homeSettings: any;
  positions: any;
  sorted_postions: any = {}
  result: any = []

  constructor(
    private cdr: ChangeDetectorRef,
    private HomeSettingsService: HomeSettingsService
  ) { }

  ngOnInit(): void {
    this.HomeSettingsService.getHomeSettings().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.homeSettings = res?.result
        for (let data of this.homeSettings) {
          let sorted_result = []
          let unsorted_result = data?.positions
          for (var key in unsorted_result) {
            sorted_result.push([key, unsorted_result[key]]);
          }
          sorted_result.sort((a: any, b: any) => {
            return a[1].value - b[1].value
          })
          sorted_result.forEach((data: any) => {
            this.sorted_postions[data[0]] = data[1]
          })
          data.positions = this.sorted_postions
        }
        if (this.homeSettings.length > 0) {
          this.positions = this.homeSettings[0].positions
          for (let key of Object.keys(this.positions)) {
            this.result.push(this.positions[key])
          }
        }
        this.slug = res?.result[0]?.slug
        this.cdr.markForCheck()
      } else {
        this.homeSettings = []
      }
    })

    this.HomeSettingsService.getHomeSettingsCount().subscribe((res: any) => {
      if (res?.result) {
        this.dashboardSettingsCount = res?.result
      } else {
        this.dashboardSettingsCount = 0
      }
      this.cdr.markForCheck()
    })
  }

}
