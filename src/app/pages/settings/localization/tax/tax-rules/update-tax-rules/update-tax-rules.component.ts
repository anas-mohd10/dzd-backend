import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { ToastrService } from 'ngx-toastr';
import { TaxRulesService } from 'src/app/includes/services/tax-rules.service';

@Component({
  selector: 'app-update-tax-rules',
  templateUrl: './update-tax-rules.component.html',
  styleUrls: ['./update-tax-rules.component.scss'],
})
export class UpdateTaxRulesComponent implements OnInit {
  taxRulesForm: FormGroup;
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  status: boolean;
  formData: any = {};
  taxRules: any;
  taxRuleData: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taxRulesService: TaxRulesService,
    private toastr: ToastrService
  ) {}

  get tf() {
    return this.taxRulesForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.taxRules = this.route.snapshot.queryParams.taxRules || ''
    this.managePage();
    this.getTaxRules()
  }

  initForm() {
    this.taxRulesForm = this.formBuilder.group({
      name: [''],
      rate: [''],
      type: [''],
      isActive: [''],
    });
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

  getTaxRules(){
    this.taxRulesService.getTaxRulesBySlug(this.taxRules).subscribe((res: any) => {
       this.taxRuleData = res?.result[0]
       this.taxRulesForm.get("name")?.setValue(this.taxRuleData?.name)
       this.taxRulesForm.get("type")?.setValue(this.taxRuleData?.type)
       this.taxRulesForm.get("rate")?.setValue(this.taxRuleData?.rate)
       this.taxRulesForm.get("isActive")?.setValue(this.taxRuleData?.isActive)
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  //Update exsisting tax rules
  updateBrand() {
    if (!this.taxRulesForm.valid) {
      return;
    }

    for (const data of Object.keys(this.taxRulesForm.value)) {
      if (this.taxRulesForm.value[data] != '' || null) {
        this.formData[data] = this.taxRulesForm.value[data];
      }
    }

    this.taxRulesService.updateTaxRules(this.taxRules, this.formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Tax Rule Updated Successfully');
        this.router.navigate([this.appRoute.taxRules.TAX_RULES_LIST]);
      }
    });
  }

  //Add tax rules
  addBrand() {}
}
