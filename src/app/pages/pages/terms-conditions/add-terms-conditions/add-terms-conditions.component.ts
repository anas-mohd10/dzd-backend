import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { TermsConditionsService } from 'src/app/includes/services/terms-conditions.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
    placeholder: 'Enter terms and conditions here',
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
      this.isData = res?.result.length > 0 ? true : false
      let data = res?.result[0]
      this.slug = data?.slug
      this.termsconditionsForm.get("description")?.setValue(data?.description)
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
    if (!this.termsconditionsForm.valid) {
      this.isSubmitted = true
      return;
    }

    if (!this.isData) {
      this.termsconditionsService.createTermsConditions(this.termsconditionsForm.value).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    } else {
      this.termsconditionsService.updateTermsConditions(this.slug, this.termsconditionsForm.value).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    }
  }

  afterResult(errorcode: any, message: any) {
    if (errorcode != 0) {
      this.toastr.error(message);
    } else if (errorcode == 0) {
      this.toastr.success(message);
      this.isHidden = true
      this.ngOnInit()
    }
  }

}
