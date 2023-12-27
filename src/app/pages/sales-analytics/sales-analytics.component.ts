import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';

interface OrderDetails {
  title: string
  value: number
}

@Component({
  selector: 'app-sales-analytics',
  templateUrl: './sales-analytics.component.html',
  styleUrls: ['./sales-analytics.component.scss']
})

export class SalesAnalyticsComponent implements OnInit {
  appRoute = appRoutes
  modalRef?: BsModalRef
  duration: FormControl = new FormControl('current')
  orders: Array<OrderDetails> = [
    { title: 'Return requested', value: 3 },
    { title: 'Total cancelled', value: 7 },
    { title: 'Total accepted', value: 20 },
    { title: 'Total delivered', value: 17 },
    { title: 'Total shipped', value: 9 },
  ]

  constructor(
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {

  }

  getDuration(template: TemplateRef<any>) {
    if (this.duration.value == 'date-range') {
      this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' });
    }
  }

  navigateBack() {

  }

}
