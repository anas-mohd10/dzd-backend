import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  form: FormGroup;
  task = PageTasks.ADD;
  rules: Array<any> = []
  ruleDetails: Array<any> = []

  constructor(
    private FormBuilder: FormBuilder,
    private Router: Router,
    private TaxClassesService: TaxClassesService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private TaxRulesService: TaxRulesService
  ) { }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      name: ['', Validators.required],
      description: [''],
      rules: [[], Validators.required],
      isActive: ['true'],
    });

    this.TaxRulesService.getActiveRules().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ruleDetails = res?.result
        this.ChangeDetectorRef.markForCheck()
      } else {
        this.ToastrService.error(res?.message)
      }
    });
  }

  selectRule(event: any) {
    let rule = this.ruleDetails.filter((rule: any) => { if (rule._id == event.target.value) return rule })
    !this.rules.includes(rule[0]) ? this.rules.push(rule[0]) : this.ToastrService.info('Rule already present')
    this.form.get('rules')?.setValue(this.rules)
  }

  removeRule(index: any) {
    this.rules.splice(index, 1)
    this.form.get('rules')?.setValue(this.rules)
  }

  add() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.TaxClassesService.addClass(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
          this.Router.navigate([this.appRoute.taxClass.TAX_CLASS_LIST])
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }
}
