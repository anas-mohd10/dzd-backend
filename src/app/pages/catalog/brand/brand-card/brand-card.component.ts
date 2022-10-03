import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-brand-card',
  templateUrl: './brand-card.component.html',
  styleUrls: ['./brand-card.component.scss']
})
export class BrandCardComponent implements OnInit {

  appRoute = appRoutes;
  brandData: any;
  displayTable: boolean = false;
  base: any

  constructor(private brandService: BrandService) { }

  ngOnInit(): void {
    this.base = environment.base
    this.brandService.getBrand().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.brandData = res?.result
          break;
      }
    });
  }

}
