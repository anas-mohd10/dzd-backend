import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { TermsConditionsService } from 'src/app/includes/services/terms-conditions.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HotToastService } from '@ngneat/hot-toast';


@Component({
  selector: 'app-add-terms-conditions',
  templateUrl: './add-terms-conditions.component.html',
  styleUrls: ['./add-terms-conditions.component.scss']
})
export class AddTermsConditionsComponent implements OnInit {
  appRoute = appRoutes

  form: FormGroup

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
      { class: 'figtree', name: 'Figtree' },
      { class: 'poppins', name: 'Poppins' }
    ]
  };

  constructor(
    private TermsConditionsService: TermsConditionsService,
    private FormBuilder: FormBuilder,
    private HotToastService: HotToastService,
    ) { }

  ngOnInit(): void {
    this.initForm()
    this.getAbout()
  }

  initForm() {
    this.form = this.FormBuilder.group({
      description: ['', Validators.required]
    });
  }

  get formControls() {
    return this.form.controls;
  }

  getAbout() {
    this.TermsConditionsService.getTermsConditions().subscribe((res: any) => {
      this.isData = res?.result.length > 0 ? true : false
      let data = res?.result[0]
      this.slug = data?.slug
      this.form.get("description")?.setValue(data?.description)
    })
  }

  reloadPage() {
    this.isSubmitted = false
    this.isHidden = true
    this.ngOnInit()
  }


  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    if (!this.isData) {
      this.TermsConditionsService.createTermsConditions(this.form.value).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    } else {
      this.TermsConditionsService.updateTermsConditions(this.slug, this.form.value).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    }
  }

  afterResult(errorcode: any, message: any) {
    if (errorcode != 0) {
      this.HotToastService.error(message);
    } else if (errorcode == 0) {
      this.HotToastService.success(message);
      this.isHidden = true
      this.ngOnInit()
    }
  }

}
