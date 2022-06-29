import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OfferService } from '../../../../includes/services/offer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shipping-list',
  templateUrl: './shipping-list.component.html',
  styleUrls: ['./shipping-list.component.scss']
})
export class ShippingListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  // public dtTrigger: Subject<any> = new Subject();
  appRoute = appRoutes;
  shippingData: any;
  activeFilter: boolean = false;
  shippingForm: FormGroup;
  displayTable: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
