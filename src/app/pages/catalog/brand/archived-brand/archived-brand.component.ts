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
  base: string = `${environment.base}/`
  page: number = 1;
  limit: number = 40;
  totalPages: number = 1
  totalResults: number = 0

  constructor(
    private BrandService: BrandService,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
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

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getBrands()
  }

  getBrands() {
    setTimeout(() => {
      this.BrandService.searchBrands({
        ...this.form.value,
        page: this.page,
        isArchive: true,
        limit: this.limit
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.brands = res?.result?.data
          this.page = res?.result?.page
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
          this.ChangeDetectorRef.markForCheck()
        }
      })
    }, 800)
  }

}
