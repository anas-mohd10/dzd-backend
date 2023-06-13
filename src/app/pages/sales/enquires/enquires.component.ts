import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { appRoutes } from 'src/app/config/routes'
import { EnquiryService } from 'src/app/includes/services/enquiry.service'

@Component({
  selector: 'app-enquires',
  templateUrl: './enquires.component.html',
  styleUrls: ['./enquires.component.scss']
})
export class EnquiresComponent implements OnInit {
  appRoute = appRoutes
  data: Array<any> = []
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  query: any = {}
  page: String = "1"
  limit: String = "30"
  form: FormGroup

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private EnquiryService: EnquiryService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.payload()
    this.EnquiryService.searchEnquiry(this.query).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result?.data
      }
    })
  }

  initForm() {
    this.form = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl(''),
      email: new FormControl('', Validators.required),
      countryCode: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    })
  }

  reset() {
    this.keyword?.setValue(null)
    this.isActive?.setValue(null)
  }

  payload() {
    return this.query = {
      keyword: this.keyword.value,
      page: this.page,
      limit: this.limit,
    }
  }

  search() {
    this.payload()
    this.EnquiryService.searchEnquiry(this.query).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result?.data
      }
    })
  }
}

