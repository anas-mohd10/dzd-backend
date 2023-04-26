import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AboutService } from 'src/app/includes/services/about.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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
    placeholder: 'Enter about here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'manrope', name: 'Manrope' }
    ]
  };

  constructor(
    private aboutService: AboutService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

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
      if (res?.errorCode == 0) {
        this.isData = res?.result.length > 0 ? true : false
        let data = res?.result[0]
        this.slug = data?.slug
        this.aboutForm.get("description")?.setValue(data?.description)
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
    if (!this.aboutForm.valid) {
      this.isSubmitted = true
      return;
    }
    if (!this.isData) {
      this.aboutService.createAbout(this.aboutForm.value).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    } else {
      this.aboutService.updateAbout(this.slug, this.aboutForm.value).subscribe((res: any) => {
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
