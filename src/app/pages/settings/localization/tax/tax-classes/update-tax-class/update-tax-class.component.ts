import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { ToastrService } from 'ngx-toastr';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { TaxRulesService } from 'src/app/includes/services/tax-rules.service';

@Component({
  selector: 'app-update-tax-class',
  templateUrl: './update-tax-class.component.html',
  styleUrls: ['./update-tax-class.component.scss'],
})
export class UpdateTaxClassComponent implements OnInit {
  taxClassForm: FormGroup;
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes;

  isSubmitted = false;
  params: any;
  fileData: File;
  status: boolean;
  formData: any = {};
  taxClass: any;
  taxClassData: any;
  taxRuleNames: any;
  taxRule: any;
  ruleId: any;
  rulesArray: any;
  rulesName: any;

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
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.taxClass = this.route.snapshot.queryParams.taxClass || '';
    this.params = this.route.snapshot;
    this.managePage();
    this.getTaxClass();
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
      name: [''],
      description: [''],
      isActive: [''],
      rules: [''],
    });
  }

  getTaxRules() {
    this.taxClassesService.getTaxRulesName().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.taxRuleNames = res?.result;
          for (let i = 0; i < this.taxRuleNames.length; i++) {
            this.taxClassForm.get('rules')?.setValue(this.taxRuleNames[i].name);
          }
      }
    });
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

  getTaxClass() {
    this.taxClassesService
      .getTaxClassesBySlug(this.taxClass)
      .subscribe((res: any) => {
        switch (res?.errorCode) {
          case 0:
            this.taxClassData = res?.result[0];
            break;
        }
        this.taxClassForm.get('name')?.setValue(this.taxClassData.name);
        this.taxClassForm.get('description')?.setValue(this.taxClassData.description);
        // this.taxClassForm.get('rules')?.setValue(this.taxClassData.rules);
        this.taxClassForm.get('isActive')?.setValue(this.taxClassData.isActive);
      });
  }

  //Update exsisting tax classes
  updateBrand() {
    if (!this.taxClassForm.valid) {
      return;
    }

    for (const data of Object.keys(this.taxClassForm.value)) {
      if (this.taxClassForm.value[data] != '' || null) {
        this.formData[data] = this.taxClassForm.value[data];
      }
      if (data == 'rules') {
        for (let i = 0; i < this.taxRuleNames.length; i++) {
          if (this.taxRuleNames[i].name == this.taxClassForm.value[data]) {
            this.ruleId = this.taxRuleNames[i]._id;
            this.formData[data] = this.ruleId;
          }
        }
      }
    }

    this.taxClassesService
      .updateTaxClasses(this.taxClass, this.formData)
      .subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something Went Wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Tax Class Updated Successfully');
          this.router.navigate([this.appRoute.taxClass.TAX_CLASS_LIST]);
        }
      });
  }

  //Add tax classes
  addBrand() { }
}
