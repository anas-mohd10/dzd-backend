import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})
export class SubscribersComponent implements OnInit {
  appRoute = appRoutes
  page: number = 1
  limit: FormControl = new FormControl('20')
  lastPage: boolean = false
  keyword: FormControl = new FormControl('')
  subscribers: Array<any> = []
  subscriber: string = ''
  modalRef?: BsModalRef;

  constructor(
    private CustomersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getSubscribers()
  }

  getSubscribers() {
    this.CustomersService.searchSubscribers({
      keyword: this.keyword?.value,
      page: this.page,
      limit: this.limit?.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.subscribers = res?.result?.data
          this.lastPage = res?.result?.lastPage
          this.ChangeDetectorRef.markForCheck()
        }
      },
      error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  getPreviousPage() {
    this.page -= 1
    this.getSubscribers()
  }

  getNextPage() {
    this.page += 1
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

  exportSubscribers() {
    this.CustomersService.downloadSubscribers().subscribe({
      next: (res: any) => {
        this.ToastrService.success(res?.message)
      },
      error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }
}