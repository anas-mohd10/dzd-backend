import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';

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

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    for (let i = 3; i >= 0; i--) {
      this.years.push((new Date().getFullYear() - i).toString())
    }
    this.years.reverse()
    this.initform()
    this.getDetails()
  }

  initform() {
    let year = new Date().getFullYear()
    this.form = new FormGroup({
      startMonth: new FormControl(''),
      startYear: new FormControl(year),
      endMonth: new FormControl(''),
      endYear: new FormControl(year),
    })
  }

  getDetails() {

  }

}
