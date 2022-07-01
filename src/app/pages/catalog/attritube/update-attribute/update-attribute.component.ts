import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { AttributeService } from '../../../../includes/services/attribute.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-attribute',
  templateUrl: './update-attribute.component.html',
  styleUrls: ['./update-attribute.component.scss'],
})
export class UpdateAttributeComponent implements OnInit {
  attributeForm: FormGroup;
  task = PageTasks.UPDATE;
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
  attribute: any;

  constructor(
    private formBuilder: FormBuilder,
    private CategoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private AttributeService: AttributeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.category = this.route.snapshot.queryParams.category || '';
    this.attribute = this.route.snapshot.queryParams.attribute || '';
    this.initForm();
    this.managePage();
    this.getCategoryDetails();
  }

  initForm() {
    this.attributeForm = this.formBuilder.group({
      name: [''],
      values: [],
      filtered: [''],
      status: [''],
      tags: ['']
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

  getCategoryDetails() {
    this.CategoryService.getCategoryBySlug(this.category).subscribe((res) => {
      this.categoryData = res;
      this.categoryId = this.categoryData.result[0]._id;
      return this.getAttributeDetails(this.attribute, this.categoryId);
    });
  }

  getAttributeDetails(attribute: any, category: any) {
    this.AttributeService.getAttributeBuSlug(attribute, category).subscribe(
      (res: any) => {
        this.attributeForm.get('name')?.setValue(res?.result[0].name);
        this.attributeForm.get('status')?.setValue(res?.result[0].isActive);
        this.attributeForm.get('filtered')?.setValue(res?.result[0].isFiltered);
        this.valueArray = res?.result[0].value;
      }
    );
  }

  tagInput() {
    if (this.attributeForm.get('values')?.value != ' ' || '' || this.attributeForm.get('values')?.value == null) {
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  updateBrand() {
    if (!this.attributeForm.valid) {
      console.log('Form not valid')
      return;
    }
    this.attributeData = {
      name: this.attributeForm.get('name')?.value,
      value: this.valueArray,
      isFiltered: this.attributeForm.get('filtered')?.value,
      isActive: this.attributeForm.get('status')?.value,
      categoryId: this.categoryId
    };
    this.AttributeService.updateAttribute(this.attribute, this.categoryId, this.attributeData).subscribe(
      (res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res?.errorCode == 0) {
          this.toastr.success('Attribute updated successfully');
          this.router.navigate([this.appRoute.attribute.ATTRIBUTE_LIST], {
            queryParams: { category: this.category },
          });
        }
      }
    );
  }

  addBrand() {}
}
