import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AboutService } from 'src/app/includes/services/about.service';

@Component({
  selector: 'app-add-about',
  templateUrl: './add-about.component.html',
  styleUrls: ['./add-about.component.scss']
})
export class AddAboutComponent implements OnInit {

  appRoute = appRoutes
  aboutData: any;
  displayTable: boolean;
  aboutForm: FormGroup
  task = PageTasks.ADD;
  editMode = false;
  isSubmitted: boolean;
  len: any
  isHidden: Boolean = true
  slug: any;

  constructor(private aboutService: AboutService, private formBuilder: FormBuilder, private router: Router,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getAbout()
  }

  initForm() {
    this.aboutForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  get af() {
    return this.aboutForm.controls;
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
    this.aboutService.getAbout().subscribe((res: any) => {
      this.len = res?.result.length
      this.slug = res?.result[0].slug
      this.aboutForm.get("description")?.setValue(res?.result[0].description)
    })
  }

  reloadPage() {
    window.location.reload()
  }

  showButton() {
    this.isHidden = false
  }

  onSubmit() {
    if (!this.aboutForm.valid) {
      console.error("Validation error")
      return;
    }
    if (this.len == 0) {
      this.aboutService.createAbout(this.aboutForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('About added successfully');
          this.router.navigate([this.appRoute.about.ABOUT]);
        }
      })
    } else {
      this.aboutService.updateAbout(this.slug, this.aboutForm.value).subscribe((res: any) => {
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
