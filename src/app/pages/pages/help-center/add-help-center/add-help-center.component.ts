import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { HelpCenterService } from 'src/app/includes/services/help-center.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
  isData: Boolean = false
  isHidden: Boolean = true
  slug: any;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter help center description here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'manrope', name: 'Manrope' },
    ]
  };

  constructor(
    private helpcenterService: HelpCenterService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getAbout()
  }

  initForm() {
    this.helpcenterForm = this.formBuilder.group({
      description: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
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
      if (res?.errorCode == 0) {
        this.isData = res?.result.length > 0 ? true : false
        this.slug = res?.result[0].slug
        this.helpcenterForm.get("description")?.setValue(res?.result[0].description)
        this.helpcenterForm.get("phone")?.setValue(res?.result[0].phone)
        this.helpcenterForm.get("email")?.setValue(res?.result[0].email)
      }
    })
  }

  reloadPage() {
    this.isSubmitted = false
    this.isHidden = true
    this.ngOnInit()
  }

  showButton() {
    this.isHidden = false
  }

  onSubmit() {
    if (!this.helpcenterForm.valid) {
      console.error("Validation error")
      return;
    }
    if (!this.isData) {
      this.helpcenterService.createHelpCenter(this.helpcenterForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Help request added successfully');
          this.router.navigate([this.appRoute.helpcenter.HELPCENTER]);
          window.location.reload()
        }
      })
    } else {
      this.helpcenterService.updateHelpCenter(this.slug, this.helpcenterForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Help request added successfully');
          window.location.reload()
        }
      })
    }
  }

}
