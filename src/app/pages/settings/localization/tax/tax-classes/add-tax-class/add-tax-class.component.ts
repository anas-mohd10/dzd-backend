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
  ruleId: any;
  rulesArray: any = [];
  rulesName: any = [];

  validationMessages = {
    name: [{ type: 'required', message: 'Tax class name is required' }],
    rules: [{ type: 'required', message: 'Tax rule required' }],
  };


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taxClassesService: TaxClassesService,
    private toastr: ToastrService
  ) { }

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
      rule: [Validators.required],
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

  tagRule() {
    let rule = this.taxClassForm.get("rule")?.value
    if (!this.rulesArray.includes(rule)) {
      this.rulesArray.push(rule)
      for (let i = 0; i < this.taxRuleNames.length; i++) {
        if (this.taxRuleNames[i]._id == rule) {
          this.rulesName.push(this.taxRuleNames[i].name)
        }
      }
    } else {
      this.toastr.info("Tax rule already added")
    }
    this.taxClassForm.get("rule")?.setValue('')
  }

  tagRemove(name: any) {
    let index = this.rulesName.indexOf(name)
    if (index > -1) {
      this.rulesName.splice(index, 1);
    }
    for (let i = 0; i < this.taxRuleNames.length; i++) {
      if (this.taxRuleNames[i].name == name) {
        let idIndex = this.rulesArray.indexOf(this.taxRuleNames[i]._id)
        if (idIndex > -1) {
          this.rulesArray.splice(idIndex, 1);
        }
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

  updateBrand() { }

  addBrand() {
    if (!this.taxClassForm.valid) {
      return;
    }
    let data = {
      name: this.taxClassForm.get("name")?.value,
      description: this.taxClassForm.get("description")?.value,
      isActive: this.taxClassForm.get("isActive")?.value,
      rule: JSON.stringify(this.rulesArray)
    }
    this.taxClassesService.addTaxClasses(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Tax Class Added Successfully');
        this.router.navigate([this.appRoute.taxClass.TAX_CLASS_LIST]);
      }
    });
  }
}
