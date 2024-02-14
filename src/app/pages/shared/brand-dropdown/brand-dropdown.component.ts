import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { event } from 'jquery';
import { BrandService } from 'src/app/includes/services/brand.service';

interface BrandProps {
  name: string,
  slug: string,
  _id: string,
  thumbnail: string
}

@Component({
  selector: 'app-brand-dropdown',
  templateUrl: './brand-dropdown.component.html',
  styleUrls: ['./brand-dropdown.component.scss']
})


export class BrandDropdownComponent implements OnInit, OnChanges {
  brands: Array<BrandProps> = [];
  brandDetails: BrandProps;
  @Input('brandDetails') brand?: BrandProps;
  @Output() brandTriggered = new EventEmitter<any>();
  searchKeyword: FormControl = new FormControl('', Validators.required)

  constructor(
    private BrandService: BrandService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.brand) {
      this.brandDetails = this.brand;
      this.searchKeyword.setValue(this.brand.name);
    }
  }

  getBrands() {
    if (!this.searchKeyword.valid) {
      return;
    }

    this.BrandService.getBrandDetails(this.searchKeyword.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.brands = res.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    })
  }

  brandClicked(brand: BrandProps) {
    this.brandTriggered.emit(brand);
    this.brandDetails = brand;
    this.searchKeyword.setValue(brand.name);
    this.brands = [];
  }

  ngOnInit(): void {
  }

  createBrand() {
    this.BrandService.createBrands({ name: this.searchKeyword.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getBrands();
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }
}
