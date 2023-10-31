import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  isSubmitted: boolean;
  isDetected: Boolean = false
  form: FormGroup
  details: any
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
    private Service: HelpCenterService,
    private formBuilder: FormBuilder,
    private router: Router,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
      countryCode: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });

    this.Service.getDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result
          for (let _key of Object.keys(res?.result)) this.form.get(_key)?.setValue(res?.result[_key])
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  get formControls() {
    return this.form.controls;
  }

  cancel() {
    this.isSubmitted = false
    this.isDetected = false
    this.ngOnInit()
  }

  detectChanges() {
    this.isDetected = true
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.Service.manage(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ngOnInit()
          this.ChangeDetectorRef.markForCheck()
          this.isSubmitted = false
          this.isDetected = false
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  sendVerification() {
    this.Service.shareVerification().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }
}
