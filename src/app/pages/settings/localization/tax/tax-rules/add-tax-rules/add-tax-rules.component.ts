import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { ToastrService } from 'ngx-toastr';
import { TaxRulesService } from 'src/app/includes/services/tax-rules.service';

@Component({
  selector: 'app-add-tax-rules',
  templateUrl: './add-tax-rules.component.html',
  styleUrls: ['./add-tax-rules.component.scss'],
})
export class AddTaxRulesComponent implements OnInit {
  form: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted: boolean = false;

  constructor(
    private FormBuilder: FormBuilder,
    private Router: Router,
    private TaxRulesService: TaxRulesService,
    private ToastrService: ToastrService
  ) { }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      name: ['', Validators.required],
      rate: ['', Validators.required],
      isActive: ['true'],
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
