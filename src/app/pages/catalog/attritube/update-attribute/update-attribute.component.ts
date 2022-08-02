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
  textArray: any = [];
  colorArray: any = [];
  imageArray: any = [];
  valueType: any;
  textFlag: boolean = false;
  colorFlag: boolean = false;
  imageFlag: boolean = false;
  values: any;
  type: any;

  constructor(
    private formBuilder: FormBuilder,
    private CategoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private AttributeService: AttributeService,
    private toastr: ToastrService
  ) { }

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
      valueType: [''],
      values: [],
      colorValue: [],
      isFiltered: [''],
      isActive: [''],
      tags: [''],
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

  handleInputChange(fileInput: any) { }

  getCategoryDetails() {
    this.CategoryService.getCategoryBySlug(this.category).subscribe((res) => {
      this.categoryData = res;
      this.categoryId = this.categoryData.result[0]._id;
      return this.getAttributeDetails(this.attribute, this.categoryId);
    });
  }

  getAttributeDetails(attribute: any, category: any) {
    this.AttributeService.getAttributeBuSlug(attribute, category).subscribe((res: any) => {
      this.attributeForm.get('name')?.setValue(res?.result[0].name);
      this.attributeForm.get('isActive')?.setValue(res?.result[0].isActive);
      this.attributeForm.get('isFiltered')?.setValue(res?.result[0].isFiltered);
      this.attributeForm.get('valueType')?.setValue(res?.result[0].valueType);
      this.valueType = res?.result[0].valueType
      if (this.valueType == 'text') {
        this.textFlag = true;
        this.colorFlag = false;
        this.imageFlag = false;
        this.textArray = res?.result[0].value;
      } else if (this.valueType == 'color') {
        this.textFlag = false;
        this.colorFlag = true;
        this.imageFlag = false;
        this.colorArray = res?.result[0].value;
      } else if (this.valueType == 'image') {
        this.textFlag = false;
        this.colorFlag = false;
        this.imageFlag = true;
        this.textArray = res?.result[0].value;
      }
    }
    );
  }

  tagInput() {
    if (this.attributeForm.get('values')?.value != ' ' || '' || null) {
      this.textArray.push(this.attributeForm.get('values')?.value);
      this.attributeForm.get('values')?.setValue('');
    }
  }

  tagRemove(value: any) {
    const index = this.textArray.indexOf(value);
    if (index > -1) {
      this.textArray.splice(index, 1);
    }
  }

  changeValueType() {
    this.valueType = this.attributeForm.get('valueType')?.value;
    if (this.valueType == 'text') {
      this.textFlag = true;
      this.colorFlag = false;
      this.imageFlag = false;
    } else if (this.valueType == 'color') {
      this.textFlag = false;
      this.colorFlag = true;
      this.imageFlag = false;
    } else if (this.valueType == 'image') {
      this.textFlag = false;
      this.colorFlag = false;
      this.imageFlag = true;
    }
  }

  getColorCode() {
    this.colorArray.push(this.attributeForm.get('colorValue')?.value);
  }

  colorRemove(color: any) {
    const index = this.colorArray.indexOf(color);
    if (index > -1) {
      this.colorArray.splice(index, 1);
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
      return;
    }

    if (this.valueType == 'color') {
      this.values = this.colorArray;
    } else if (this.valueType == 'text') {
      this.values = this.textArray;
    } else if (this.valueType == 'image') {
      this.values = [];
    }

    this.attributeData = {
      name: this.attributeForm.get('name')?.value,
      valueType: this.attributeForm.get('valueType')?.value,
      value: this.values,
      file: '',
      isFiltered: this.attributeForm.get('isFiltered')?.value,
      isActive: this.attributeForm.get('isActive')?.value,
      categoryId: this.categoryId,
    };

    this.AttributeService.updateAttribute(
      this.attribute,
      this.categoryId,
      this.attributeData
    ).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res?.errorCode == 0) {
        this.toastr.success('Attribute updated successfully');
        this.router.navigate([this.appRoute.attribute.ATTRIBUTE_LIST], {
          queryParams: { category: this.category },
        });
      }
    });
  }

  addBrand() { }
}
