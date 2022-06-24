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
  taxRulesForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  status: boolean;
  formData: any = {};

  validationMessages = {
    name: [{ type: 'required', message: 'Brand name is required' }],
    rate: [{ type: 'required', message: 'Rate is required' }],
  };

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
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.managePage();
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
    this.taxRulesForm = this.formBuilder.group({
      name: ['', Validators.required],
      rate: ['', Validators.required],
      isActive: ['No', Validators.required],
    });
  }
}
