import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ReportsService } from 'src/app/includes/services/reports.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})
export class SubscribersComponent implements OnInit {
  appRoute = appRoutes
  page: number = 1
  limit: number = 40
  totalPages: number = 1
  totalResults: number= 0
  keyword: FormControl = new FormControl('')
  subscribers: Array<any> = []
  subscriber: string = ''
  modalRef?: BsModalRef;

  constructor(
    private CustomersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private BsModalService: BsModalService,
    private ReportsService: ReportsService
  ) { }

  ngOnInit(): void {
    this.getSubscribers()
  }

  getSubscribers() {
    setTimeout(() => {
      this.CustomersService.searchSubscribers({
        keyword: this.keyword?.value,
        page: this.page,
        limit: this.limit
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.subscribers = res?.result?.data
            this.totalResults = res?.result?.totalResults
            this.totalPages = res?.result?.totalPages
            this.ChangeDetectorRef.markForCheck()
          }
        },
        error: (err: any) => {
          this.ToastrService.error(err?.message)
        }
      })
    }, 800)
  }

  onPageTriggered(event: {pageIndex: number, pageSize: number}){
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getSubscribers()
  }

  openModal(template: TemplateRef<any>, subscribe: string) {
    this.subscriber = subscribe
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm' });
  }

  decline() {
    this.subscriber = ''
    this.modalRef?.hide();
  }

  confirm() {
    this.CustomersService.deleteSubscriber(this.subscriber).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSubscribers()
          this.subscriber = ''
          this.modalRef?.hide();
          this.ChangeDetectorRef.markForCheck()
        }
      },
      error: (err: any) => {
        this.ToastrService.error(err?.message)
      },
    })
  }
}