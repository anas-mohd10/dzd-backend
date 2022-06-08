import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OfferService } from '../../../../includes/services/offer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss'],
})
export class OfferListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  appRoute = appRoutes;
  offerData: any;
  activeFilter: boolean = false;
  offerForm: FormGroup;

  constructor(
    private offerService: OfferService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getOffer();
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      retrieve: true,
      destroy: true,
    };
  }

  initForm() {
    this.offerForm = this.formBuilder.group({
      active: ['No', Validators.required],
    });
  }

  onChange(){
    if(this.offerForm.value.active == "Yes"){
      this.activeFilter = true
      this.getOffer()
    }
    if(this.offerForm.value.active == "No"){
      this.activeFilter = false
      this.getOffer()
    }
  }

  getOffer() {
    if (this.activeFilter == false) {
      this.offerService.getOffer().subscribe((res: any) => {
        switch (res?.errorCode) {
          case 0:
            this.offerData = res?.result;
            for (let i = 0; i < this.offerData.length; i++) {
              this.offerData[i].fromDate = new Date(
                this.offerData[i].fromDate
              ).toDateString();
            }
            for (let i = 0; i < this.offerData.length; i++) {
              this.offerData[i].lastDate = new Date(
                this.offerData[i].lastDate
              ).toDateString();
            }
            break;
        }
        this.dtTrigger.next();
      });
    } else if (this.activeFilter == true) {
      this.offerService.getActiveOffer().subscribe((res: any) => {
        switch (res?.errorCode) {
          case 0:
            this.offerData = res?.result;
            for (let i = 0; i < this.offerData.length; i++) {
              this.offerData[i].fromDate = new Date(
                this.offerData[i].fromDate
              ).toDateString();
            }
            for (let i = 0; i < this.offerData.length; i++) {
              this.offerData[i].lastDate = new Date(
                this.offerData[i].lastDate
              ).toDateString();
            }
            break;
        }
        this.dtTrigger.next();
      });
    }
  }

  onSubmit() {}
}
