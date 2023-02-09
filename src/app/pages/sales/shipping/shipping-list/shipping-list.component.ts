import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { ExternalShippingService } from 'src/app/includes/services/external.shipping.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-shipping-list',
  templateUrl: './shipping-list.component.html',
  styleUrls: ['./shipping-list.component.scss']
})
export class ShippingListComponent implements OnInit {
  appRoutes = appRoutes
  data: any = []
  base: any

  constructor(private cdr: ChangeDetectorRef, private service: ExternalShippingService) { }

  ngOnInit(): void {
    this.base = environment.base
    
    this.service.getAllShippings({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.cdr.markForCheck()
      }
    })
  }

}
