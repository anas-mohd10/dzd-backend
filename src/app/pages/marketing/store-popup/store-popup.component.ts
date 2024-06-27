import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { PopupService } from 'src/app/includes/services/popup.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-store-popup',
  templateUrl: './store-popup.component.html',
  styleUrls: ['./store-popup.component.scss']
})
export class StorePopupComponent implements OnInit {
  appRoute = appRoutes
  details: any = {}
  @ViewChild('template') templateRef: TemplateRef<any>
  modalRef?: BsModalRef
  preview: any
  popupType: string

  mobileFile: any
  webFile: any
  appFile: any
  webPreview: any
  mobilePreview: any
  appPreview: any
  webFileInput: FormControl = new FormControl('')
  mobileFileInput: FormControl = new FormControl('')
  appFileInput: FormControl = new FormControl('')
  webRedirection: FormControl = new FormControl('')
  mobileRedirection: FormControl = new FormControl('')
  appRedirection: FormControl = new FormControl('')
  isWeb: boolean = false
  isMobile: boolean = false
  isApp: boolean = false

  constructor(
    private PopupService: PopupService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getDetails()
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  close() {
    this.modalRef?.hide()
    this.preview = null
    this.webFile = null
    this.mobileFile = null
  }

  handleWebChange(event: any) {
    this.webFile = event?.target?.files[0]
    let webReader = new FileReader();
    webReader.onload = (e: any) => { this.preview = e.target.result };
    webReader.readAsDataURL(this.webFile);
    this.ChangeDetectorRef.markForCheck()
    this.open(this.templateRef)
    this.popupType = 'website'
  }

  handleMobileChange(event: any) {
    this.mobileFile = event?.target?.files[0]
    let mobileReader = new FileReader();
    mobileReader.onload = (e: any) => { this.preview = e.target.result };
    mobileReader.readAsDataURL(this.mobileFile);
    this.ChangeDetectorRef.markForCheck()
    this.open(this.templateRef)
    this.popupType = 'mobile'
  }

  handleAppChange(event: any) {
    this.appFile = event?.target?.files[0]
    let appReader = new FileReader();
    appReader.onload = (e: any) => { this.preview = e.target.result };
    appReader.readAsDataURL(this.appFile);
    this.ChangeDetectorRef.markForCheck()
    this.open(this.templateRef)
    this.popupType = 'app'
  }

  removeMedia(type: string) {
    switch (type) {
      case 'website':
        this.webFileInput.setValue('')
        this.webFile = null
        this.webPreview = null
        break
      case 'mobile':
        this.mobileFileInput.setValue('')
        this.mobileFile = null
        this.mobilePreview = null
        break
      case 'app':
        this.appFileInput.setValue('')
        this.appFile = null
        this.appPreview = null
        break
    }

    this.PopupService.removePopup(type).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }, complete: () => {
        this.getDetails()
      }
    })
  }

  getDetails() {
    this.PopupService.popupDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result
          this.webRedirection.setValue(this.details?.websiteRedirect)
          this.mobileRedirection.setValue(this.details?.mobileRedirect)
          this.appRedirection.setValue(this.details?.appRedirect)
          this.details?.website ? this.webPreview = environment.base + this.details?.website?.path : null
          this.details?.mobile ? this.mobilePreview = environment.base + this.details?.mobile?.path : null
          this.details?.app ? this.appPreview = environment.base + this.details?.app?.path : null

          this.details?.website ? this.isWeb = true : this.isWeb = false
          this.details?.app ? this.isApp = true : this.isApp = false
          this.details?.mobile ? this.isMobile = true : this.isMobile = false

          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  onSubmit() {
    let formdata = new FormData()
    this.webFile ? formdata.append('website', this.webFile) : null
    this.mobileFile ? formdata.append('mobile', this.mobileFile) : null
    this.appFile ? formdata.append('app', this.appFile) : null
    formdata.append('websiteRedirect', this.webRedirection.value)
    formdata.append('mobileRedirect', this.mobileRedirection.value)
    formdata.append('appRedirect', this.appRedirection.value)

    this.PopupService.managePopup(formdata).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
          this.webFile = null
          this.mobileFile = null
          this.appFile = null
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }, complete: () => {
        this.getDetails()
        this.modalRef?.hide()
      }
    })
  }
}
