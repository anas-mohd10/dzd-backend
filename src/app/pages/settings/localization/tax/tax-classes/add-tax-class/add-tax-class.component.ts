import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { TaxRulesService } from 'src/app/includes/services/tax-rules.service';
import { HotToastService } from '@ngneat/hot-toast';

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
  rules: Array<any> = []
  ruleDetails: Array<any> = []

  constructor(
    private FormBuilder: FormBuilder,
    private Router: Router,
    private TaxClassesService: TaxClassesService,
    private HotToastService: HotToastService,
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
      rule: [''],
      rules: ['', Validators.required],
      isActive: ['true'],
    });

    this.TaxRulesService.getActiveRules().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ruleDetails = res?.result
        this.ChangeDetectorRef.markForCheck()
      } else {
        this.HotToastService.error(res?.message)
      }
    });
  }

  selectRule(event: any) {
    let rule = this.ruleDetails.filter((rule: any) => {
      if (rule._id == event.target.value) {
        return rule
      }
    })

    this.rules.includes(rule[0]) ?
      this.HotToastService.info('Rule already present') :
      this.rules.push(rule[0])

    this.form.get('rule')?.setValue('')
  }

  removeRule(index: any) {
    this.rules.splice(index, 1)
  }

  add() {
    this.form.get('rules')?.setValue(this.rules)

    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.TaxClassesService.addClass(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.Router.navigate([this.appRoute.taxClass.TAX_CLASS_LIST])
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }
}
