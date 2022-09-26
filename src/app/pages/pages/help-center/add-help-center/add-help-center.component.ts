import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { HelpCenterService } from 'src/app/includes/services/help-center.service';


@Component({
  selector: 'app-add-help-center',
  templateUrl: './add-help-center.component.html',
  styleUrls: ['./add-help-center.component.scss']
})
export class AddHelpCenterComponent implements OnInit {
  appRoute = appRoutes
  aboutData: any;
  displayTable: boolean;
  helpcenterForm: FormGroup
  task = PageTasks.ADD;
  editMode = false;
  isSubmitted: boolean;
  len: any
  isHidden: Boolean = true
  slug: any;

  constructor(private helpcenterService: HelpCenterService, private formBuilder: FormBuilder, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getAbout()
  }

  initForm() {
    this.helpcenterForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  get hf() {
    return this.helpcenterForm.controls;
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
    this.helpcenterService.getHelpCenter().subscribe((res: any) => {
      this.len = res?.result.length
      this.slug = res?.result[0].slug
      this.helpcenterForm.get("description")?.setValue(res?.result[0].description)
    })
  }

  reloadPage() {
    window.location.reload()
  }

  showButton() {
    this.isHidden = false
  }

  onSubmit() {
    if (!this.helpcenterForm.valid) {
      console.error("Validation error")
      return;
    }
    if (this.len == 0) {
      this.helpcenterService.createHelpCenter(this.helpcenterForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Help Request added successfully');
          this.router.navigate([this.appRoute.helpcenter.HELPCENTER]);
        }
      })
    } else {
      this.helpcenterService.updateHelpCenter(this.slug, this.helpcenterForm.value).subscribe((res: any) => {
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
