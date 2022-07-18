import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { AttributeService } from '../../../../includes/services/attribute.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss'],
})
export class AttributeComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};

  appRoute = appRoutes;
  category: any;
  attributeData: any;
  attributeLength: any;
  categoryId: any;
  displayTable: boolean = false;
  categoryName: any;

  constructor(
    private route: ActivatedRoute,
    private CategoryService: CategoryService,
    private AttributeService: AttributeService
  ) {}

  ngOnInit(): void {
    this.category = this.route.snapshot.queryParams.category || '';
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 5,
      processing: true,
    };
    this.getDetails();
  }

  getDetails() {
    this.CategoryService.getCategoryBySlug(this.category).subscribe(
      (res: any) => {
        switch (res?.errorCode) {
          case 0:
            this.categoryName = res?.result[0].name;
            this.categoryId = res?.result[0]._id;
            this.AttributeService.getCategoryById(this.categoryId).subscribe(
              (res: any) => {
                this.attributeData = res?.result;
                this.displayTable = true;
              }
            );
            break;
        }
      }
    );
  }
}
