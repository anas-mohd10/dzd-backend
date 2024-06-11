import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { HelpCenterService } from 'src/app/includes/services/help-center.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { validators } from 'src/app/config/constants/mobile-validators';
import { HotToastService } from '@ngneat/hot-toast';
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
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
      countryCode: ['+971', Validators.required],
      phone: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });

    this.handleMobilePattern()
    this.getDetails()
  }

  getDetails() {
    this.Service.getDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result
          this.form.patchValue(res?.result)
          this.handleMobilePattern()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  get formControls() {
    return this.form.controls;
  }

  updateMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.form.get('phone')?.setValidators(newValidators);
    this.form.get('phone')?.updateValueAndValidity();
  }

  handleMobilePattern() {
    switch (this.form.get("countryCode")?.value) {
      case "+91":
        this.updateMobilePattern(`^[0-9]{${validators.india.validation.maximum}}$`);
        break;
      case "+971":
        this.updateMobilePattern(`^[0-9]{${validators.uae.validation.maximum}}$`);
        break;
    }
  }

  cancel() {
    this.isSubmitted = false
    this.isDetected = false
    this.ngOnInit()
    this.getDetails()
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
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  sendVerification() {
    this.Service.shareVerification().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }
}
