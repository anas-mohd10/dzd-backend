import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { HotToastService } from '@ngneat/hot-toast';
import { TaxRulesService } from 'src/app/includes/services/tax-rules.service';

@Component({
  selector: 'app-add-tax-rules',
  templateUrl: './add-tax-rules.component.html',
  styleUrls: ['./add-tax-rules.component.scss'],
})
export class AddTaxRulesComponent implements OnInit {
  form: FormGroup;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted: boolean = false;

  constructor(
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
  }

  add() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.TaxRulesService.addRule({ ...this.form.value }).subscribe({
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
