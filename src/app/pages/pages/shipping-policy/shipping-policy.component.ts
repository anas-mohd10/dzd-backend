import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { ContentService } from 'src/app/includes/services/content.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-shipping-policy',
  templateUrl: './shipping-policy.component.html',
  styleUrls: ['./shipping-policy.component.scss']
})
export class ShippingPolicyComponent implements OnInit {
  appRoutes = appRoutes
  contentDetails: string = ''
  shippingPolicy: FormControl = new FormControl('', Validators.required)
  isSubmitted: boolean = false
  isHidden: boolean = true
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
    placeholder: 'Enter shipping policy here',
    defaultFontName: 'Be Vietnam Pro',
    defaultFontSize: '5',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'manrope', name: 'Manrope' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
    ]
  };

  constructor(
    private ContentService: ContentService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: HotToastService
  ) { }

  ngOnInit(): void {
    this.ContentService.getContents().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.shippingPolicy.setValue(res?.result?.shippingPolicy)
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
    if (!this.shippingPolicy.valid) {
      this.isSubmitted = true
      return
    }

    this.ContentService.manageContent({ shippingPolicy: this.shippingPolicy.value }).subscribe({
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
