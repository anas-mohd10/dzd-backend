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
  data: any = {}
  len: any = 0
  slug: any
  generalSettingsCount: any

  constructor(
    private cdr: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.data['colors']['primary'] = '#' + this.data['colors']['primary'].split('FF')[1]
        this.data['colors']['secondary'] = '#' + this.data['colors']['secondary'].split('FF')[1]
        this.data['colors']['label'] = '#' + this.data['colors']['label'].split('FF')[1]
        this.data['colors']['text'] = '#' + this.data['colors']['text'].split('FF')[1]
        this.data['colors']['star'] = '#' + this.data['colors']['star'].split('FF')[1]
        this.data['toast']['success'] = '#' + this.data['toast']['success'].split('FF')[1]
        this.data['toast']['error'] = '#' + this.data['toast']['error'].split('FF')[1]
        this.slug = res?.result?.refid
        this.cdr.markForCheck()
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
