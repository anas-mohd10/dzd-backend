import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {
  device: string = 'desktop';
  isDraft: boolean = false;
  screenLoad: number = 0;

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  deviceToggled(event: string) {
    this.device = event;
    this.ChangeDetectorRef.markForCheck();
  }


}
