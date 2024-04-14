import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
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
  limit: number = 30
  page: number = 1
  totalPages: number = 1
  totalResults: number = 0
  query: any = {}
  form: FormGroup
  enquiry: any = {}
  lastPage: Boolean = false;
  modalRef: BsModalRef

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private EnquiryService: EnquiryService,
    private BsModalService: BsModalService
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
      limit: this.limit
    }
    this.EnquiryService.searchEnquiry(this.query).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.enquires = res?.result?.data
        this.lastPage = res?.result?.lastPage
        this.totalResults = res?.result?.totalResults
        this.totalPages = res?.result?.totalPages
        this.page = res?.result?.page
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  open(template: TemplateRef<any>, data: any){
    this.modalRef = this.BsModalService.show(template, {class: 'modal-lg modal-dialog-centered'})
    this.enquiry = data
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getEnquiries()
  }
}

