import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/includes/services/orders.service';


@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss']
})
export class GenerateInvoiceComponent implements OnInit {
  order: string = ''
  orderDetails: any = {}

  constructor(
    private OrdersService: OrdersService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.order = this.ActivatedRoute.snapshot.queryParams.order || ''
    this.OrdersService.getOrderDetails({ order: this.order }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orderDetails = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  print(content: any) {
    let contents: any = document.querySelector('.' + content)?.innerHTML
    let body = document.body.innerHTML
    document.body.innerHTML = contents
    window.print()
    document.body.innerHTML = body;
  }

}
