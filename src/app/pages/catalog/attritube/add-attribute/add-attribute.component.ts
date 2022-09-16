import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { AttributeService } from '../../../../includes/services/attribute.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { timers } from 'jquery';

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
  slug: any
  attributeValues: any;
  categoryData: any;
  attributeData: {};
  status: boolean;
  filtered: string;
  isFiltered: any;
  textArray: any = [];
  colorArray: any = [];
  imageArray: any = [];
  type: any;
  textFlag: boolean = false;
  colorFlag: boolean = false;
  imageFlag: boolean = false;
  values: any = [];
  images: any = [];
  imagesArray: any = [];
  localdata: any = []
  imageValues: any;
  url: any;
  filedata: any

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
    this.slug = this.route.snapshot.queryParams.category || '';
    this.getCategoryDetails();
    this.managePage();
  }

  initForm() {
    this.attributeForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['check', Validators.required],
      file: [''],
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

  getCategoryDetails() {
    this.CategoryService.getCategoryBySlug(this.slug).subscribe((res) => {
      this.categoryData = res;
      this.category = this.categoryData.result[0]._id;
    });
  }

  changeValueType() {
    this.type = this.attributeForm.get('type')?.value;
    if (this.type == 'text') {
      this.textFlag = true;
      this.colorFlag = false;
      this.imageFlag = false;
      this.localdata = []
      this.colorArray = []
    } else if (this.type == 'color') {
      this.textFlag = false;
      this.colorFlag = true;
      this.imageFlag = false;
      this.localdata = []
      this.textArray = []
    } else if (this.type == 'image') {
      this.textFlag = false;
      this.colorFlag = false;
      this.imageFlag = true;
      this.colorArray = []
      this.textArray = []
    }
  }

  //Tag input
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

  //Color input
  getColorCode() {
    this.colorArray.push(this.attributeForm.get('colorValue')?.value);
  }

  colorRemove(color: any) {
    const index = this.colorArray.indexOf(color);
    if (index > -1) {
      this.colorArray.splice(index, 1);
    }
  }

  //Image input
  handleInputChange(event: any) {
    if (event.target.files.length > 0) {
      let reader = new FileReader()
      this.filedata = event.target.files[0]
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e: any) => {
        this.url = e.target.result
      }
    }
  }

  addFile() {
    this.localdata.push({
      id: this.localdata.length,
      url: this.url,
      file: this.filedata
    })
    this.attributeForm.get("file")?.setValue('')
  }

  removeFile(id: any) {
    this.localdata = this.localdata.filter((_data: any) => _data.id != id)
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateAttribute();
    } else {
      this.addAttribute();
    }
  }

  updateAttribute() { }

  addAttribute() {
    if (!this.attributeForm.valid) {
      console.log("Validation error");
      return;
    }
    if (this.type == 'color') {
      this.values = this.colorArray;
    } else if (this.type == 'text') {
      this.values = this.textArray;
    } else if (this.type == 'image') {
      for (let data of this.localdata) {
        this.images.push(data.file)
      }
      this.values = []
    }
    const formdata = new FormData
    if (this.images.length) {
      for (let img of this.images) {
        formdata.append('file', img);
      }
      formdata.append("files", this.images)
    }
    formdata.append("values", JSON.stringify(this.values))
    for (const data of Object.keys(this.attributeForm.value)) {
      formdata.append(data, this.attributeForm.value[data]);
    }
    formdata.append("category", this.category)
    this.AttributeService.addAttribute(formdata).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res?.errorCode == 0) {
        this.toastr.success('Attribute added successfully');
        this.router.navigate(
          [this.appRoute.attribute.ATTRIBUTE_LIST],
          { queryParams: { category: this.slug } });
      }
    });
  }
}
