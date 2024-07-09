import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-brand-card',
  templateUrl: './brand-card.component.html',
  styleUrls: ['./brand-card.component.scss']
})
export class BrandCardComponent implements OnInit {
  appRoute = appRoutes;
  brands: Array<any> = [];
  form: FormGroup;
  base: string = `${environment.base}`
  page: number = 1
  limit: number = 40
  isLastPage: Boolean = false;
  totalResults: number = 0
  totalPages: number = 1

  constructor(
    private BrandService: BrandService,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.getBrands()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getBrands()
  }

  initForm() {
    this.form = new FormGroup({
      keyword: new FormControl(''),
      isActive: new FormControl(''),
      isFeatured: new FormControl(''),
    });
  }

  clearFilters() {
    this.initForm()
    this.getBrands()
  }

  onReload() {
    this.initForm()
    this.getBrands()
  }

  getBrands() {
    setTimeout(() => {
      this.BrandService.searchBrands({
        ...this.form.value,
        isArchive: false,
        page: this.page,
        limit: this.limit
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.brands = res?.result?.data
          this.page = res?.result?.page
          this.totalResults = res?.result?.totalResults
          this.isLastPage = res?.result?.isLastPage
          this.totalPages = res?.result?.totalPages
          this.ChangeDetectorRef.markForCheck()
        }
      })
    }, 800)
  }
}
