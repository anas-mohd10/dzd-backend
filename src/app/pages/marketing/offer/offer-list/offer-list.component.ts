import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OfferService } from '../../../../includes/services/offer.service';

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

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.getOffer();
  }

  getOffer() {
    this.offerService.getOffer().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.offerData = res?.result;
          for(let i=0; i<this.offerData.length; i++){
            this.offerData[i].fromDate = new Date(this.offerData[i].fromDate).toDateString()
          }
          for(let i=0; i<this.offerData.length; i++){
            this.offerData[i].lastDate = new Date(this.offerData[i].lastDate).toDateString()
          }
          break;
      }
      this.dtTrigger.next();
    })
  }
}
