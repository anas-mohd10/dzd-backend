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
  form: FormGroup;
  task = PageTasks.UPDATE;
  editMode = true;
  appRoute = appRoutes;
  isSubmitted = false;
  ruleDetails: any;
  rule: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private TaxRulesService: TaxRulesService,
    private ToastrService: ToastrService
  ) { }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      rate: ['', Validators.required],
      isActive: ['true'],
    });

    this.rule = this.ActivatedRoute.snapshot.queryParams.tax || ''

    this.TaxRulesService.getRuleDetails(this.rule).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ruleDetails = res?.result
        for (let _key of Object.keys(res?.result)) this.form.get(_key)?.setValue(res?.result[_key])
      } else {
        this.ToastrService.error(res.message);
      }
    })
  }

  update() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.TaxRulesService.updateRule({ ...this.form.value, slug: this.rule }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res.message);
          this.Router.navigate([this.appRoute.taxRules.TAX_RULES_LIST]);
        } else {
          this.ToastrService.error(res.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message);
      }
    });
  }
}
