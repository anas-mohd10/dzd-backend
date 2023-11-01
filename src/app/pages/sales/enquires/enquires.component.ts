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
  enquires: Array<any> = []
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  limit: FormControl = new FormControl("18")
  query: any = {}
  page: number = 1
  form: FormGroup
  enquiry: any = {}
  lastPage: Boolean = false
  totalResults: string = ''

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private EnquiryService: EnquiryService
  ) { }

  ngOnInit(): void {
    this.getEnquiries()
  }

  reset() {
    this.keyword?.setValue('')
    this.isActive?.setValue('')
  }

  getEnquiries() {
    this.query = {
      keyword: this.keyword.value,
      isActive: this.isActive.value,
      page: this.page,
      limit: this.limit?.value
    }
    this.EnquiryService.searchEnquiry(this.query).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.enquires = res?.result?.data
        this.lastPage = res?.result?.lastPage
        this.totalResults = res?.result?.totalResults
        this.page = res?.result?.page
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  getEnquiry(data: any) {
    this.enquiry = data
  }

  getPreviousPage() {
    this.page -= 1
    this.getEnquiries()
  }

  getNextPage() {
    this.page += 1
    this.getEnquiries()
  }
}

