import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { TaxRulesService } from 'src/app/includes/services/tax-rules.service';

@Component({
  selector: 'app-update-tax-rules',
  templateUrl: './update-tax-rules.component.html',
  styleUrls: ['./update-tax-rules.component.scss'],
})
export class UpdateTaxRulesComponent implements OnInit {
  form: FormGroup;
  appRoute = appRoutes;
  isSubmitted = false;
  ruleDetails: any;
  rule: string = ''

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private TaxRulesService: TaxRulesService,
    private HotToastService: HotToastService
  ) { }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      rate: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
      isActive: new FormControl('true')
    });

    this.rule = this.ActivatedRoute.snapshot.queryParams.tax || ''

    this.TaxRulesService.getRuleDetails(this.rule).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ruleDetails = res?.result
        this.form.patchValue(res?.result)
      } else {
        this.HotToastService.error(res.message);
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
          this.HotToastService.success(res.message);
          this.Router.navigate([this.appRoute.taxRules.TAX_RULES_LIST]);
        } else {
          this.HotToastService.error(res.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message);
      }
    });
  }
}
