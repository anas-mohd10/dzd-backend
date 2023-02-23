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
        this.generalSettings[0]['colors']['primary'] = '#' + this.generalSettings[0]['colors']['primary'].split('FF')[1]
        this.generalSettings[0]['colors']['secondary'] = '#' + this.generalSettings[0]['colors']['secondary'].split('FF')[1]
        this.generalSettings[0]['colors']['label'] = '#' + this.generalSettings[0]['colors']['label'].split('FF')[1]
        this.generalSettings[0]['colors']['text'] = '#' + this.generalSettings[0]['colors']['text'].split('FF')[1]
        this.generalSettings[0]['colors']['star'] = '#' + this.generalSettings[0]['colors']['star'].split('FF')[1]
        this.slug = res?.result[0]?.refid
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
