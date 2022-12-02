import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-product-success',
  templateUrl: './product-success.component.html',
  styleUrls: ['./product-success.component.scss']
})
export class ProductSuccessComponent implements OnInit {

  name: any
  prodid: any
  appRoutes = appRoutes

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private ProductService: ProductService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.prodid = this.ActivatedRoute.snapshot.queryParams.id || ''

    if (this.prodid) {
      this.ProductService.getProductbyId({ prodid: this.prodid }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.name = res?.result[0]?.name
          this.cdr.markForCheck()
        }
      })
    }
  }

}
