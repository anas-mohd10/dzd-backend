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
  base: any
  len: any;
  count: any;
  pages: any = [];
  page: any = 1;
  limit: any = 4;
  datalength: any;
  isPreviousExist: boolean = false;
  currPage: any;
  isNextExist: boolean = true;
  isData: boolean = true;
  selectedPage: any = 1;
  name:any

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
        this.pages.push({
          key: i,
        })
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

  onChange() {
    this.brandService.searchBrand(this.brandForm.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.brands = res?.result?.data
        this.cdr.markForCheck();
        this.isData = true
        if (this.brands.length == 0) {
          this.isData = false
        }
        this.pages.length = 0
        this.count = Math.ceil(res?.result?.total / this.limit)
        for (let i = 1; i <= this.count; i++) {
          this.pages.push({
            key: i,
          })
        }
      }
    })
  }

  //Pagination fetch data
  fetchByPage(page: any) {
    this.selectedPage = page
    this.fetchData(this.brandForm.value, page, this.limit)
  }

  fetchByLimit(e: any) {
    this.limit = e.value
    this.fetchData(this.brandForm.value, this.page, this.limit)
  }

  fetchData(data: any, page: any, limit: any) {
    this.brandService.searchBrand(data, page, limit).subscribe((res: any) => {
      this.brands = res?.result.data
      this.pages.length = 0
      this.isData = true
      if (this.brands.length == 0) {
        this.isData = false
      }
      this.cdr.markForCheck();
      this.count = Math.ceil(res?.result?.total / this.limit)
      for (let i = 1; i <= this.count; i++) {
        this.pages.push({
          key: i,
        })
      }
    })
  }
}
