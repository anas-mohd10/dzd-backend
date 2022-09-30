import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { PrivacyPolicyService } from 'src/app/includes/services/privacy-policy.service';

@Component({
  selector: 'app-add-privacy-policy',
  templateUrl: './add-privacy-policy.component.html',
  styleUrls: ['./add-privacy-policy.component.scss']
})
export class AddPrivacyPolicyComponent implements OnInit {
  appRoute = appRoutes
  aboutData: any;
  displayTable: boolean;
  privacypolicyForm: FormGroup
  task = PageTasks.ADD;
  editMode = false;
  isSubmitted: boolean;
  len: any
  isHidden: Boolean = true
  slug: any;

  constructor(private privacypolicyService: PrivacyPolicyService, private formBuilder: FormBuilder, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getAbout()
  }


  initForm() {
    this.privacypolicyForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  get pf() {
    return this.privacypolicyForm.controls;
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
    this.privacypolicyService.getPrivacyPolicy().subscribe((res: any) => {
      this.len = res?.result.length
      this.slug = res?.result[0].slug
      this.privacypolicyForm.get("description")?.setValue(res?.result[0].description)
    })
  }

  reloadPage() {
    window.location.reload()
  }

  showButton() {
    this.isHidden = false
  }

  onSubmit() {
    if (!this.privacypolicyForm.valid) {
      console.error("Validation error")
      return;
    }
    if (this.len == 0) {
      this.privacypolicyService.createPrivacyPolicy(this.privacypolicyForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Privacy policy added successfully');
          this.router.navigate([this.appRoute.privacypolicy.PRIVACYPOLICY]);
          window.location.reload()
        }
      })
    } else {
      this.privacypolicyService.updatePrivacyPolicy(this.slug, this.privacypolicyForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Privacy policy added successfully');
          window.location.reload()
        }
      })
    }
  }

}
