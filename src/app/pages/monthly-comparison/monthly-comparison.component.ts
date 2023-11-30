import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { DashboardService } from 'src/app/includes/services/dashboard.service';

@Component({
  selector: 'app-monthly-comparison',
  templateUrl: './monthly-comparison.component.html',
  styleUrls: ['./monthly-comparison.component.scss']
})
export class MonthlyComparisonComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup
  months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  years: Array<string> = []
  today: string = new Date().toDateString()
  month: string = ''
  settings: any = {}
  summaryDetails: any = {
    start: { orders: 0, sales: '', average: '', isProfit: false, salesDifference: 0 },
    end: { orders: 0, sales: '', average: '', isProfit: false, salesDifference: 0 }
  }
  cancelledDetails: any = {
    start: { orders: 0, sales: '', average: '' },
    end: { orders: 0, sales: '', average: '' }
  }

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private DashboardService: DashboardService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    for (let i = 3; i >= 0; i--) {
      this.years.push((new Date().getFullYear() - i).toString())
    }
    this.years.reverse()
    this.initform()
    this.getDetails()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      } else {
        this.ToastrService.error(res?.message)
      }
    })
  }

  initform() {
    let year = new Date().getFullYear()
    const currentDate = new Date();
    const current = currentDate.getMonth();
    this.month = this.months[current]
    const previous = current == 0 ? 11 : current - 1;
    this.form = new FormGroup({
      startMonth: new FormControl(this.months[previous]),
      startYear: new FormControl(year),
      endMonth: new FormControl(this.months[current]),
      endYear: new FormControl(year),
    })
  }

  getDetails() {
    let payload = {
      start: { month: this.form.value.startMonth, year: this.form.value.startYear },
      end: { month: this.form.value.endMonth, year: this.form.value.endYear }
    }

    this.DashboardService.monthlyComparison(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.summaryDetails = res?.result?.summary
          this.cancelledDetails = res?.result?.cancelled
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }

}
