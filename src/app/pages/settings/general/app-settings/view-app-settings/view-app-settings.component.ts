import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-view-app-settings',
  templateUrl: './view-app-settings.component.html',
  styleUrls: ['./view-app-settings.component.scss']
})
export class ViewAppSettingsComponent implements OnInit {
  appRoute = appRoutes
  generalSettings: any
  len: any = 0
  slug: any
  generalSettingsCount: any

  constructor(
    private cdr: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettings().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.generalSettings = res?.result
        this.slug = res?.result[0]?.slug
        this.cdr.markForCheck()
      } else {
        this.generalSettings = []
      }
    })

    this.AppSettingsService.getGeneralSettingsCount().subscribe((res: any) => {
      if (res?.result) {
        this.generalSettingsCount = res?.result
      } else {
        this.generalSettingsCount = 0
      }
      this.cdr.markForCheck()
    })
  }

}
