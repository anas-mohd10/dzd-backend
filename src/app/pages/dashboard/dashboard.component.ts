import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/includes/services/customers.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  customersCount: any;
  constructor(private customersService: CustomersService) { }

  ngOnInit(): void {
    this.getCustomersCount()
  }

  getCustomersCount() {
    this.customersService.getCustomersCoumt().subscribe((res: any) => {
      this.customersCount = res?.result
      console.log(this.customersCount);
    })
  }
}
