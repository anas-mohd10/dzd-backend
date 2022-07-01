import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { AttributeService } from '../../../../includes/services/attribute.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss'],
})
export class AddAttributeComponent implements OnInit {
  attributeForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  params: any;
  fileData: File;
  category: any;
  attributeValues: any;
  categoryData: any;
  categoryId: any;
  attributeData: {};
  status: boolean;
  filtered: string;
  isFiltered: any;
  valueArray: any = [];

  validationMessages = {
    name: [
      {
        type: 'required',
        message: 'Category name is required',
      },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private CategoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private AttributeService: AttributeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.category = this.route.snapshot.queryParams.category || '';
    this.getCategoryDetails();
    this.managePage();
  }

  initForm() {
    this.attributeForm = this.formBuilder.group({
      name: ['', Validators.required],
      values: [],
      filtered: ['check', Validators.required],
      status: ['check', Validators.required],
    });
  }

  get af() {
    return this.attributeForm.controls;
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  handleInputChange(event: any) {}

  handleCheckBox(event?: any) {}

  tagInput() {
    if ((this.attributeForm.get('values')?.value != ' ' || '') || (this.attributeForm.get('values')?.value == null )) {
      this.valueArray.push(this.attributeForm.get('values')?.value);
      this.attributeForm.get('values')?.setValue('');
    }
  }

  tagRemove(value: any) {
    for (let i = 0; i < this.valueArray.length; i++) {
      if (this.valueArray[i] == value) {
        this.valueArray.pop(value);
      }
    }
  }

  getCategoryDetails() {
    this.CategoryService.getCategoryBySlug(this.category).subscribe((res) => {
      this.categoryData = res;
      this.categoryId = this.categoryData.result[0]._id;
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  updateBrand() {}

  addBrand() {
    if (!this.attributeForm.valid) {
      return;
    }
    this.attributeData = {
      name: this.attributeForm.get('name')?.value,
      value: this.valueArray,
      isFiltered: this.attributeForm.get('filtered')?.value,
      isActive: this.attributeForm.get('status')?.value,
      categoryId: this.categoryId
    };
    this.AttributeService.addAttribute(this.attributeData).subscribe(
      (res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res?.errorCode == 0) {
          this.toastr.success('Attribute added successfully');
          this.router.navigate([this.appRoute.attribute.ATTRIBUTE_LIST], {
            queryParams: { category: this.category },
          });
        }
      }
    );
  }
}
