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
  textArray: any = [];
  colorArray: any = [];
  imageArray: any = [];
  valueType: any;
  textFlag: boolean = false;
  colorFlag: boolean = false;
  imageFlag: boolean = false;
  values: any;
  images: any = [];
  imagesArray: any = [];


  validationMessages = {
    name: [
      {
        type: 'required',
        message: 'Category name is required',
      },
    ],
  };
  imageValues: any;

  constructor(
    private formBuilder: FormBuilder,
    private CategoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private AttributeService: AttributeService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.category = this.route.snapshot.queryParams.category || '';
    this.getCategoryDetails();
    this.managePage();
  }

  initForm() {
    this.attributeForm = this.formBuilder.group({
      name: ['', Validators.required],
      valueType: ['check', Validators.required],
      values: [],
      colorValue: [],
      imageValue: [],
      isFiltered: ['false', Validators.required],
      isActive: ['true', Validators.required],
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

  // handleInputChange(fileInput: any) {
  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     this.fileData = <File>fileInput.target.files[0];
  //     const imageName = fileInput.target.files[0].name;
  //     var filesAmount = fileInput.target.files.length;
  //     for (let i = 0; i < filesAmount; i++) {
  //       var reader = new FileReader();
  //       this.fileData = <File>fileInput.target.files[i];
  //       reader.onload = (event: any) => {
  //         this.imageArray.push({
  //           name: imageName,
  //           url: event.target.result,
  //         });
  //         this.imagesArray.push(fileInput.target.files[i]);
  //         this.images.push(this.fileData);
  //         this.attributeForm.patchValue({
  //           attributeImage: this.images,
  //         });
  //       };
  //       reader.readAsDataURL(fileInput.target.files[i]);
  //     }
  //   }
  //   this.attributeForm.get('imageValue')?.setValue('');
  // }

  handleInputChange(fileInput: any) {
    let files = fileInput.target.files
    for (let i = 0; i < files.length; i++) {
      let filedata = <File>files[i];
      this.imagesArray.push(filedata)
    }
  }

  handleCheckBox(event?: any) { }

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

  getCategoryDetails() {
    this.CategoryService.getCategoryBySlug(this.category).subscribe((res) => {
      this.categoryData = res;
      this.categoryId = this.categoryData.result[0]._id;
    });
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

  updateBrand() { }

  addBrand() {
    if (!this.attributeForm.valid) {
      this.toastr.warning('Some error occurred');
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
      valueType: this.valueType,
      value: this.values,
      isFiltered: this.attributeForm.get('isFiltered')?.value,
      isActive: this.attributeForm.get('isActive')?.value,
      categoryId: this.categoryId,
    };

    // console.log(this.attributeForm.get("imageValue")?.value);

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
