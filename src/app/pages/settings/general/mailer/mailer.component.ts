import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { MailerService } from 'src/app/includes/services/mailer.service';

@Component({
  selector: 'app-mailer',
  templateUrl: './mailer.component.html',
  styleUrls: ['./mailer.component.scss']
})
export class MailerComponent implements OnInit {
  appRoute = appRoutes
  mailerDetails: any
  form: FormGroup

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private MailerService: MailerService,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      orderTransactions: new FormControl([]),
      cancelledOrders: new FormControl([]),
      dailyReports: new FormControl([]),
      abandonedCarts: new FormControl([]),
      subscribers: new FormControl([]),
      newsletters: new FormControl([]),
    })
    this.getMailerDetails()
  }

  getMailerDetails() {
    this.MailerService.mailerDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.mailerDetails = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.error.message)
      }
    })
  }

  manageMailer() {
    this.MailerService.manageMailers(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getMailerDetails()
          this.ToastrService.error(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.error.message)
      }
    })
  }

}
