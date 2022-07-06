import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { ToastrService } from 'ngx-toastr';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { TaxRulesService } from 'src/app/includes/services/tax-rules.service';

@Component({
  selector: 'app-add-tax-class',
  templateUrl: './add-tax-class.component.html',
  styleUrls: ['./add-tax-class.component.scss'],
})
export class AddTaxClassComponent implements OnInit {
  taxClassForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  params: any;
  fileData: File;
  status: boolean;
  formData: any = {};
  taxRuleNames: any;
  ruleNames: any = [];
  selected: any;
  filtered: any;
  ruleNameFlag: boolean;
  ruleFlag: boolean = false;

  validationMessages = {
    name: [{ type: 'required', message: 'Tax class name is required' }],
    rules: [{ type: 'required', message: 'Tax rule required' }],
  };
  ruleId: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taxClassesService: TaxClassesService,
    private toastr: ToastrService
  ) {}

  get tf() {
    return this.taxClassForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.params = this.route.snapshot;
    this.managePage();
    this.getTaxRules();
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

  initForm() {
    this.taxClassForm = this.formBuilder.group({
      name: ['', Validators.required],
      ruleId: ['', Validators.required],
      description: [''],
      isActive: ['true', Validators.required],
    });
  }

  getTaxRules() {
    this.taxClassesService.getTaxRulesName().subscribe(
      (res: any) => {
        this.taxRuleNames = res?.result;
        for (let i = 0; i < this.taxRuleNames.length; i++) {
          this.taxClassForm.get('rules')?.setValue(this.taxRuleNames[i].name);
        }
      },
      (error) => console.log(error)
    );
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  //Update exsisting tax classes
  updateBrand() {}

  //Add tax classes
  addBrand() {
    if (!this.taxClassForm.valid) {
      return;
    }
    for (const data of Object.keys(this.taxClassForm.value)) {
      if (this.taxClassForm.value[data] != '' || null) {
        this.formData[data] = this.taxClassForm.value[data];
      }
    }
    this.taxClassesService
      .addTaxClasses(this.formData)
      .subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something Went Wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Tax Class Added Successfully');
          this.router.navigate([this.appRoute.taxClass.TAX_CLASS_LIST]);
        }
      });
  }
}
