import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  taxRuleNames: any;
  rulesArray: any = [];
  rulesName: any = [];
  taxClassRate: any = 0
  taxClassData: any;
  taxClass: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taxClassesService: TaxClassesService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private taxRulesService: TaxRulesService
  ) { }

  get tf() {
    return this.taxClassForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.taxClass = this.route.snapshot.queryParams.taxClass || '';
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
      rule: [''],
    });
  }

  getTaxRules() {
    this.taxRulesService.getActiveTaxRules().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.taxRuleNames = res?.result;
          for (let i = 0; i < this.taxRuleNames.length; i++) {
            this.taxClassForm.get('rules')?.setValue(this.taxRuleNames[i].name);
          }
          this.cdr.markForCheck()
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
          this.taxClassRate = this.taxClassRate + this.taxRuleNames[i].rate
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
        this.taxClassRate = this.taxClassRate - this.taxRuleNames[i].rate
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
    this.taxClassesService.getTaxClassesBySlug(this.taxClass).subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.taxClassData = res?.result[0];
          break;
      }
      this.taxClassForm.get('name')?.setValue(this.taxClassData.name);
      this.taxClassForm.get('description')?.setValue(this.taxClassData.description);
      this.taxClassForm.get('rule')?.setValue('');
      for (let i = 0; i < this.taxClassData.rule.length; i++) {
        this.rulesArray.push(this.taxClassData.rule[i]._id)
        this.rulesName.push(this.taxClassData.rule[i].name)
      }
      this.taxClassForm.get('isActive')?.setValue(this.taxClassData.isActive);
      this.taxClassRate = this.taxClassData.rate
      this.cdr.markForCheck()
    });
  }

  updateBrand() {
    if (!this.taxClassForm.valid) {
      return;
    }
    let data = {
      name: this.taxClassForm.get("name")?.value,
      description: this.taxClassForm.get("description")?.value,
      isActive: this.taxClassForm.get("isActive")?.value,
      rule: JSON.stringify(this.rulesArray),
      rate: this.taxClassRate
    }
    this.taxClassesService.updateTaxClasses(this.taxClass, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Tax Class Updated Successfully');
        this.router.navigate([this.appRoute.taxClass.TAX_CLASS_LIST]);
      }
    });
  }

  addBrand() { }
}
