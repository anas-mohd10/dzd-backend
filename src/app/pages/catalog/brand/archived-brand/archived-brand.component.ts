import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-archived-brand',
  templateUrl: './archived-brand.component.html',
  styleUrls: ['./archived-brand.component.scss']
})
export class ArchivedBrandComponent implements OnInit {
  appRoute = appRoutes;
  brands: Array<any> = [];
  form: FormGroup;
  base: any
  settings: any = {}
  page: number = 1
  limit: FormControl = new FormControl('40')
  lastPage: Boolean = false;
  totalCount: number = 0

  constructor(
    private BrandService: BrandService,
    private FormBuilder: FormBuilder,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.getBrands()
  }

  initForm() {
    this.form = this.FormBuilder.group({
      keyword: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  clearFilters() {
    this.initForm()
    this.getBrands()
  }

  getNextPage() {
    this.page += 1
    this.getBrands()
  }

  getPreviousPage() {
    this.page -= 1
    this.getBrands()
  }

  onReload() {
    this.initForm()
    this.getBrands()
  }

  getBrands() {
    this.BrandService.searchBrand({
      ...this.form.value,
      page: this.page,
      isArchive: true,
      limit: this.limit.value
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.brands = res?.result?.data
        this.page = res?.result?.page
        this.totalCount = res?.result?.total_item
        this.lastPage = res?.result?.lastPage
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

}
