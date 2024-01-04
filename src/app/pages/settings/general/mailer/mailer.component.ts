import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  isChangeDetected: boolean = false
  mailers: any = {
    orderTransactions: [],
    cancelledOrders: [],
    dailyReports: [],
    abandonedCarts: [],
    subscribers: [],
    newsletters: [],
  }

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private MailerService: MailerService,
    private ToastrService: ToastrService
  ) { }

  get formControls() {
    return this.form.controls
  }

  resetMailers() {
    this.mailers = {
      orderTransactions: [],
      cancelledOrders: [],
      dailyReports: [],
      abandonedCarts: [],
      subscribers: [],
      newsletters: [],
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      orderTransactions: new FormControl('', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")),
      cancelledOrders: new FormControl('', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")),
      dailyReports: new FormControl('', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")),
      abandonedCarts: new FormControl('', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")),
      subscribers: new FormControl('', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")),
      newsletters: new FormControl('', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")),
    })
    this.getMailerDetails()
  }

  addMailer(event: any, type: string) {
    if (this.form.get(type)?.valid) {
      if (!this.mailers[type].includes(event.target.value)) this.mailers[type].push(event.target.value)
      this.form.get(type)?.setValue('')
      this.isChangeDetected = true
    }
  }

  removeMailer(mailer: string, type: string) {
    this.mailers[type] = this.mailers[type].filter((item: string) => item !== mailer)
    this.isChangeDetected = true
  }

  getMailerDetails() {
    this.MailerService.mailerDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.resetMailers()
          this.mailerDetails = res?.result
          for (let _key of Object.keys(this.mailerDetails))
            for (let item of this.mailerDetails[_key]) this.mailers[_key].push(item)
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
    this.MailerService.manageMailers(this.mailers).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getMailerDetails()
          this.ToastrService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.isChangeDetected = false
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.error.message)
      }
    })
  }

}
