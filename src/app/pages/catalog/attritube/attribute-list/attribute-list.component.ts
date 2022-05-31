import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { AttributeService } from '../../../../includes/services/attribute.service';
import { CategoryService } from 'src/app/includes/services/category.service';

@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss'],
})
export class AttributeComponent implements OnInit {
  appRoute = appRoutes;
  category: any;
  attributeData: any;
  attributeLength: any;
  categoryId: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private CategoryService: CategoryService,
    private AttributeService: AttributeService
  ) {}

  ngOnInit(): void {
    this.category = this.route.snapshot.queryParams.category || '';
    this.getCategoryDetails();
  }

  getCategoryDetails() {
    this.CategoryService.getCategoryBySlug(this.category).subscribe(
      (res: any) => {
        switch (res?.errorCode) {
          case 0:
            this.categoryId = res?.result[0]._id;
            break;
        }
        this.AttributeService.getCategoryById(this.categoryId).subscribe(
          (res: any) => {
            this.attributeData = res?.result[0]?.value;
            for(let attribute of this.attributeData){
              console.log(attribute)
            }
            this.attributeLength = this.attributeData.length;
          }
        );
      }
    );
  }

}
