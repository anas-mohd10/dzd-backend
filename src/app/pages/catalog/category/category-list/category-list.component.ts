import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  categoryData: any;

  constructor(private categoryService: CategoryService) {}


  ngOnInit(): void {
    this.getCategory()
  }

  getCategory() {
    this.categoryService.getCategory().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.categoryData = res?.result;
          break;
      }
      this.dtTrigger.next();
    });
  }
}
