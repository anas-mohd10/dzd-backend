import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { AttributeService } from '../../../../includes/services/attribute.service';
import { CategoryService } from 'src/app/includes/services/category.service';

@Component({
  selector: 'app-manage-attribute',
  templateUrl: './manage-attribute.component.html',
  styleUrls: ['./manage-attribute.component.scss'],
})
export class ManageAttributeComponent implements OnInit {
  attributeForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;

  validationMessages = {
    name: [
      {
        type: 'required',
        message: 'Attribute name is required',
      },
    ],
  };

  isSubmitted = false;
  params: any;
  fileData: File;
  category: any;

  constructor(
    private CategoryService: CategoryService,
    private route: ActivatedRoute,
    private AttributeService: AttributeService
  ) {}

  ngOnInit(): void {
    this.category = this.route.snapshot.queryParams.category || '';
    this.getCategoryDetails();
  }

  handleInputChange(event: any) {}

  handleCheckBox(event?: any) {}

  onSubmit() {}

  getCategoryDetails() {
    this.CategoryService.getCategoryBySlug(this.category).subscribe(
      (res) => {}
    );
  }
}
