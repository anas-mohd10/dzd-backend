import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from '../../../../includes/services/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss'],
})
export class BrandComponent implements OnInit {
  appRoute = appRoutes;
  brandData: any;
  constructor(private brandService: BrandService) {}

  ngOnInit(): void {}

  getBrand() {
    this.brandService.getBrand().subscribe((res: any) => {
      console.log(res?.result
        
        )
      switch (res?.ErrorCode) {
        case 0:
          this.brandData = res?.result
          break;
      }
    });
    console.log(this.brandData)
  }
}
