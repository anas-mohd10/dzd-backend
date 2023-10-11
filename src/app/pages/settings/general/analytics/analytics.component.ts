import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { AnalyticsService } from 'src/app/includes/services/analytics.service';

AnalyticsService
ToastrService

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  appRoute = appRoutes
  analytics: any = {}
  form!: FormGroup
  isButtonHidden: boolean = true

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private AnalyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      isAnalyticsEnabled: new FormControl('false'),
      analyticsId: new FormControl(''),
      isTagEnabled: new FormControl('false'),
      tagId: new FormControl(''),
      isPixelEnabled: new FormControl('true'),
      pixelId: new FormControl('')
    })

    this.AnalyticsService.getAnalyticsDetails().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.analytics = res?.result
        if (this.analytics) for (let _key of Object.keys(this.analytics)) this.form.get(_key)?.setValue(this.analytics[_key])
        this.ChangeDetectorRef.detectChanges()
      }
    })
  }

  manageAnalytics() {
    this.AnalyticsService.manageAnalytics(this.form.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ngOnInit()
        this.ToastrService.success(res?.message)
      } else {
        this.ToastrService.error(res?.message)
      }
    })
  }
}
