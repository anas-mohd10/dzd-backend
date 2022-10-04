import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-brand-card',
  templateUrl: './brand-card.component.html',
  styleUrls: ['./brand-card.component.scss']
})
export class BrandCardComponent implements OnInit {
  brandForm: FormGroup;
  appRoute = appRoutes;
  brands: any;
  displayTable: boolean = false;
  base: any
  len: any;
  count: any;
  pages: any = [];
  page: any = 1;
  limit: any = 4;
  datalength: any;
  number: any = 2
  isPreviousExist: boolean = false;
  currPage: any;
  isNextExist: boolean = true;

  constructor(
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.brandService.getBrands(this.page, this.limit).subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.brands = res?.result
          this.len = res?.result.length
          this.cdr.markForCheck();
          break;
      }
    });
    this.brandService.getBrandCount().subscribe((res: any) => {
      this.pages.length = 0
      this.datalength = res?.result
      this.cdr.markForCheck();
      this.count = Math.ceil((res?.result) / this.limit)
      for (let i = 1; i <= this.count; i++) {
        this.pages.push(i)
      }
    })
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  onReload() {
    window.location.reload()
  }

  onSubmit() {
    this.brandService.searchBrand(this.brandForm.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.brands = res?.result
        this.len = res?.result.length
        this.cdr.markForCheck();
        this.pages.length = 0
        this.count = Math.ceil((res?.result.length) / this.limit)
        for (let i = 1; i <= this.count; i++) {
          this.pages.push(i)
        }
      }
    })
  }

  fetchData(page: any) {
    this.brandService.searchBrand(this.brandForm.value, page, this.limit).subscribe((res: any) => {
      this.brands = res?.result
      this.pages.length = 0
      this.cdr.markForCheck();
      this.count = Math.ceil(this.datalength / this.limit)
      for (let i = 1; i <= this.count; i++) {
        this.pages.push(i)
      }
    })
  }

  getLimit(e: any) {
    this.limit = e.value
    this.brandService.searchBrand(this.brandForm.value, this.page, this.limit).subscribe((res: any) => {
      this.brands = res?.result
      this.pages.length = 0
      this.cdr.markForCheck();
      this.count = Math.ceil(this.datalength / this.limit)
      for (let i = 1; i <= this.count; i++) {
        this.pages.push(i)
      }
    })
  }

  nextPage() {
    if (this.number < this.pages.length) {
      this.number += 1
      this.isPreviousExist = true
      this.isNextExist = false
    }
  }

  previousPage() {
    if (this.number >= 2) {
      this.number -= 1
      this.isNextExist = true
      this.isPreviousExist = false
    }
  }
}
