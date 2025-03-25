import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { appRoutes } from "../../../../config/routes/app.routes"
import { CustomersService } from 'src/app/includes/services/customers.service';
import { CsvService } from 'src/app/includes/services/csv.service';
import { debounceTime } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})

export class CustomersListComponent implements OnInit {
  appRoute = appRoutes;
  totalPages: number = 1
  totalResults: number = 0
  customers: Array<any> = []
  limit: number = 40
  regdType: FormControl = new FormControl('')
  regdTypes: Array<any> = ['Facebook', 'Google', 'Email', 'Apple', 'Admin']
  page: number = 1
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  tagRef?: BsModalRef
  tagCustomerId: string = ''
  tag: FormControl = new FormControl('', [Validators.required, Validators.maxLength(10)])
  isTagSubmitted: boolean = false
  tagCustomerName: string = ''
  constructor(
    private customersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private CsvService: CsvService,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService


  ) {
    this.keyword.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.getCustomers()
    })
  }

  ngOnInit(): void {
    this.getCustomers()
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  formatTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  clearFilters() {
    this.keyword.setValue('')
    this.regdType.setValue('')
    this.isActive.setValue('')
    this.getCustomers()
    this.page = 1
    this.limit = 40
  }

  removeTag(userid: string, tag: number) {
    this.customersService.manageTags({ userid: userid, tag: tag }, 'delete').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getCustomers()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
      }
    })
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getCustomers()
  }

  getCustomers() {
    setTimeout(() => {
      this.customersService.searchCustomers({
        keyword: this.keyword.value,
        limit: this.limit,
        regdType: this.regdType.value,
        page: this.page,
        isActive: this.isActive.value
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.customers = res?.result?.data
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
          this.ChangeDetectorRef.markForCheck()
        }
      })
    }, 800)
  }

  openTag(template: TemplateRef<any>, userid: string, name: string) {
    this.tagRef = this.BsModalService.show(template, { class: 'modal-md modal-dialog-centered', ignoreBackdropClick: true })
    this.tagCustomerId = userid
    this.tagCustomerName = name
  }


  addTag() {
    if (!this.tag.valid) {
      this.isTagSubmitted = true
      return
    }

    this.customersService.manageTags({ userid: this.tagCustomerId, tag: this.tag.value }, 'add').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getCustomers()
          this.tagRef?.hide()
          this.HotToastService.success(res.message)
          this.tagCustomerId = ''
          this.isTagSubmitted = false
          this.tag.reset()
        } else {
          this.HotToastService.error(res.message)
        }
      },
      error: (err: any) => {
        // Check for the specific tag already exists error (422 status code with errorCode 1)
        if (err.status === 422 && err.error?.errorCode === 1) {
          this.HotToastService.error(err.error.message || 'Tag already exists for this customer')
        } else {
          this.HotToastService.error(err.message || 'An error occurred')
        }
      }
    })
  }


  closeTag() {
    this.tagRef?.hide()
    this.tagCustomerId = ''
    this.tagCustomerName = ''
  }

  downloadCustomers() {
    let payload = {
      keyword: this.keyword.value,
      limit: this.limit,
      page: this.page,
      isActive: this.isActive.value
    }

    this.CsvService.downloadUsers(payload).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'customers.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }
}


