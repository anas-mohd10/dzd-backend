import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  categoryData: any;
  displayTable: boolean = false;
  base: any
  categoryForm:FormGroup
  pages: any = [];
  page: any = 1;
  limit: any = 4;
  categories: any;
  isData: boolean = true;
  count: any;


  constructor(private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getCategory()
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.base = environment.base
  }

  getCategory() {
    this.categoryService.getCategory().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.categoryData = res?.result;
          this.cdr.markForCheck();
          this.dtTrigger.next();
          // this.categoryData[3]?.rootId.name + " > " + this.categoryData[3]?.parentId.parentId.name + " >  " + this.categoryData[3]?.parentId.name;
          break;
      }
      this.displayTable = true;
    });
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  onReload() {
    window.location.reload()
  }

  onChange() {
    this.categoryService.searchCategory(this.categoryForm.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data
        this.cdr.markForCheck();
        this.isData = true
        if (this.categories.length == 0) {
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


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
