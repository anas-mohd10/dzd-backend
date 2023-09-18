import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment.prod';
import { orderEndpoints } from 'src/app/config/endpoints';

@Component({
  selector: 'app-detailed-order',
  templateUrl: './detailed-order.component.html',
  styleUrls: ['./detailed-order.component.scss']
})
export class DetailedOrderComponent implements OnInit {
  appRoute = appRoutes
  orders: Array<any> = []
  page: number = 1
  limit: FormControl = new FormControl("20")
  keyword: FormControl = new FormControl("")
  startDate: FormControl = new FormControl("")
  endDate: FormControl = new FormControl("")
  source: FormControl = new FormControl("")
  paymentMethod: FormControl = new FormControl("")
  paymentStatus: FormControl = new FormControl("")
  products: Array<any> = []
  lastPage: boolean = false
  modalRef?: BsModalRef;
  fullReportUrl: string = environment.apiUrl + orderEndpoints.detailed_report + '/full'
  filteredReportUrl: string = environment.apiUrl + orderEndpoints.detailed_report + '/filtered'

  constructor(
    private OrdersService: OrdersService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    let firstDate = new Date()
    firstDate.setDate(1)
    this.startDate.setValue(firstDate.toISOString().split('T')[0])
    this.endDate.setValue(new Date().toISOString().split('T')[0])
    this.searchOrders()
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' });
  }

  closeModal() {
    this.modalRef?.hide();
  }

  searchOrders() {
    let payload = {
      page: this.page,
      limit: this.limit.value,
      keyword: this.keyword.value,
      from: this.startDate.value,
      to: this.endDate.value,
      source: this.source.value,
      paymentStatus: this.paymentStatus.value,
      paymentMethod: this.paymentMethod.value,
      products: this.products
    }

    this.OrdersService.getOrders(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.orders = res?.result?.orders
          this.lastPage = res?.result?.lastPage
          for (let order of this.orders) order.orderDate = new Date(order.orderDate).toDateString()
        } else {
          this.ToastrService.error(res?.message)
        }
        this.ChangeDetectorRef.markForCheck()
      },
      error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }

  getPreviousPage() {
    this.page = this.page - 1
    this.searchOrders()
  }

  getNextPage() {
    this.page = this.page + 1
    this.searchOrders()
  }
}
