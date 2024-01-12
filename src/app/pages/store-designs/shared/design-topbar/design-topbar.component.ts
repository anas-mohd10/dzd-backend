import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-design-topbar',
  templateUrl: './design-topbar.component.html',
  styleUrls: ['./design-topbar.component.scss']
})
export class DesignTopbarComponent implements OnInit {
  settings: any = {}

  constructor(
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId("1").subscribe((res: any) => {
      if(res?.errorCode == 0){
        this.settings = res?.result;
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

}
