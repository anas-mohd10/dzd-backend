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
  displayTable: boolean;

  constructor(private categoryService: CategoryService) { }


  ngOnInit(): void {
    this.getCategory()
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
  }

  getCategory() {
    this.categoryService.getCategory().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.categoryData = res?.result;3
          // this.categoryData[3]?.rootId.name + " > " + this.categoryData[3]?.parentId.parentId.name + " >  " + this.categoryData[3]?.parentId.name;
          break;
      }
      // this.dtTrigger.next();
      this.displayTable = true;
    });
  }
}
