import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { TermsConditionsService  } from 'src/app/includes/services/terms-conditions.service';

@Component({
  selector: 'app-add-terms-conditions',
  templateUrl: './add-terms-conditions.component.html',
  styleUrls: ['./add-terms-conditions.component.scss']
})
export class AddTermsConditionsComponent implements OnInit {
  appRoute = appRoutes
  aboutData: any;
  displayTable: boolean;
  termsconditionsForm: FormGroup
  task = PageTasks.ADD;
  editMode = false;
  isSubmitted: boolean;
  len: any
  isHidden: Boolean = true
  slug: any;

  constructor(private termsconditionsService: TermsConditionsService, private formBuilder: FormBuilder, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getAbout()
  }

  initForm() {
    this.termsconditionsForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  get tf() {
    return this.termsconditionsForm.controls;
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

  getAbout() {
    this.termsconditionsService.getTermsConditions().subscribe((res: any) => {
      this.len = res?.result.length
      this.slug = res?.result[0].slug
      this.termsconditionsForm.get("description")?.setValue(res?.result[0].description)
    })
  }

  reloadPage() {
    window.location.reload()
  }

  showButton() {
    this.isHidden = false
  }

  onSubmit() {
    if (!this.termsconditionsForm.valid) {
      console.error("Validation error")
      return;
    }
    if (this.len == 0) {
      this.termsconditionsService.createTermsConditions(this.termsconditionsForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Terms And Conditions added successfully');
          this.router.navigate([this.appRoute.termsconditions.TERMSCONDITIONS]);
        }
      })
    } else {
      this.termsconditionsService.updateTermsConditions(this.slug, this.termsconditionsForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('About added successfully');
          window.location.reload()
        }
      })
    }
  }

}
