import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ReplaceRequestsService } from 'src/app/includes/services/replace-requests.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-requests',
  templateUrl: './manage-requests.component.html',
  styleUrls: ['./manage-requests.component.scss']
})
export class ManageRequestsComponent implements OnInit {
  appRoute = appRoutes;
  replaceDetails: any;
  replaceId: string;
  form: FormGroup;
  settings: any;
  months: any = [
    { key: 0, value: 'January' },
    { key: 1, value: 'February' },
    { key: 2, value: 'March' },
    { key: 3, value: 'April' },
    { key: 4, value: 'May' },
    { key: 5, value: 'June' },
    { key: 6, value: 'July' },
    { key: 7, value: 'August' },
    { key: 8, value: 'September' },
    { key: 9, value: 'October' },
    { key: 10, value: 'November' },
    { key: 11, value: 'December' },
  ]
  base: string = `${environment.base}`

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute,
    private ReplaceRequestsService: ReplaceRequestsService,
    private HotToastService: HotToastService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.replaceId = this.ActivatedRoute.snapshot.params.id || '';
    if (this.replaceId) {
      this.getReplaceDetails();
    }

    this.form = new FormGroup({
      note: new FormControl(''),
      status: new FormControl('requested')
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  getSubmittedDate(date: string): string {
    return `${this.months[new Date(date).getMonth()].value} ${new Date(date).getDate()}, ${new Date(date).getFullYear()}, ${new Date(date).getHours()}:${new Date(date).getMinutes()}`
  }

  getReplaceDetails() {
    this.ReplaceRequestsService.getReplaceDetails(this.replaceId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.replaceDetails = res?.result
          this.form.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  saveReplaceDetails() {
    console.log(this.replaceDetails);
    this.ReplaceRequestsService.updateReplace({
      ...this.form.value,
      reference: this.replaceId,
      productDetails: this.replaceDetails?.productDetails,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

}
