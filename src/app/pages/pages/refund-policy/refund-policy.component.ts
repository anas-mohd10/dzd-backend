import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { ContentService } from 'src/app/includes/services/content.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.scss']
})
export class RefundPolicyComponent implements OnInit {
  appRoutes = appRoutes
  contentDetails: string = ''
  refundPolicy: FormControl = new FormControl('', Validators.required)
  isSubmitted: boolean = false
  isHidden: boolean = false
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
    placeholder: 'Enter refund policy here',
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
    private ContentService: ContentService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.ContentService.getContents().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.refundPolicy.setValue(res?.result?.refundPolicy)
        } else {
          this.ToastrService.error(res?.message)
        }
        this.ChangeDetectorRef.markForCheck()
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  cancel() {
    this.isSubmitted = false
    this.isHidden = true
    this.ngOnInit()
  }


  manage() {
    if (!this.refundPolicy.valid) {
      this.isSubmitted = true
      return
    }

    this.ContentService.manageContent({ refundPolicy: this.refundPolicy.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ngOnInit()
          this.ToastrService.success(res.message)
        } else {
          this.ToastrService.error(res.message)
        }
        this.ChangeDetectorRef.markForCheck()
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }

}
