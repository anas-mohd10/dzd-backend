import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { AppsService } from 'src/app/includes/services/apps.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-mobile-apps',
  templateUrl: './mobile-apps.component.html',
  styleUrls: ['./mobile-apps.component.scss']
})
export class MobileAppsComponent implements OnInit {
  appRoute = appRoutes
  details: any
  androidForm: FormGroup
  iosForm: FormGroup
  isSubmitted: boolean = false
  isAndroidDetected: boolean = false
  isIosDetected: boolean = false
  settings: any = {}
  currentTab: string = 'android'
  base: string = environment.base

  splashIcon: any
  splashFile: any

  appIcon: any
  appFile: any

  splashRef?: BsModalRef
  @ViewChild('splashConfirmation') splashModal: TemplateRef<any>

  appRef?: BsModalRef
  @ViewChild('appConfirmation') appModal: TemplateRef<any>

  colors: Array<any> = []

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
    private AppsService: AppsService
  ) { }

  ngOnInit(): void {
    this.initForm()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.androidForm.get('splashBackground')?.setValue(this.settings?.colors?.primary)
        this.iosForm.get('splashBackground')?.setValue(this.settings?.colors?.primary)
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.getDetails()
  }

  initForm() {
    this.androidForm = new FormGroup({
      link: new FormControl(''),
      package: new FormControl(''),
      version: new FormControl(''),
      forceUpdate: new FormControl('false'),
      name: new FormControl(''),
      buildName: new FormControl(''),
      buildCode: new FormControl(''),
      appIcon: new FormControl(''),
      splashIcon: new FormControl(''),
      splashBackground: new FormControl('')
    })

    this.iosForm = new FormGroup({
      link: new FormControl(''),
      package: new FormControl(''),
      version: new FormControl(''),
      forceUpdate: new FormControl('false'),
      name: new FormControl(''),
      buildName: new FormControl(''),
      buildCode: new FormControl(''),
      appIcon: new FormControl(''),
      splashIcon: new FormControl(''),
      itunesId: new FormControl(''),
      splashBackground: new FormControl('')
    })
  }

  getDetails() {
    this.AppsService.getApps().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result
          for (let _key of Object.keys(res?.result?.android)) this.androidForm.get(_key)?.setValue(res?.result?.android[_key])
          for (let _key of Object.keys(res?.result?.ios)) this.iosForm.get(_key)?.setValue(res?.result?.ios[_key])
          if (this.currentTab == 'android') {
            this.appIcon = res?.result?.android?.appIcon ? this.base + '/' + res?.result?.android?.appIcon : null
            this.splashIcon = res?.result?.android?.splashIcon ? this.base + '/' + res?.result?.android?.splashIcon : null
          } else {
            this.appIcon = res?.result?.ios?.appIcon ? this.base + '/' + res?.result?.ios?.appIcon : null
            this.splashIcon = res?.result?.ios?.splashIcon ? this.base + '/' + res?.result?.ios?.splashIcon : null
          }
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.error?.message)
      }
    })
  }

  toggleTab(tab: string) {
    tab == 'android' ? this.currentTab = 'android' : this.currentTab = 'ios'
    this.splashFile = null
    this.splashIcon = null
    this.appFile = null
    this.appIcon = null
    this.initForm()
    this.getDetails()
    this.isIosDetected = false
    this.isAndroidDetected = false
  }

  handleSplash(event: any) {
    this.splashFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (_event: any) => {
      this.splashIcon = _event.target.result
      this.ChangeDetectorRef.detectChanges();
    };
    reader.readAsDataURL(event.target.files[0]);
    this.splashRef = this.BsModalService.show(this.splashModal, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  handleAppIcon(event: any) {
    this.appFile = event.target.files[0]
    const reader = new FileReader();
    const image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);
    image.onload = () => {
      let height = image.width;
      let width = image.height;
      if (height != width && height != 16 && width != 16) {
        this.ToastrService.error('The specified file ' + event.target.files[0].name + ' could not be uploaded');
        this.appFile = null
        this.appIcon = null
        this.ChangeDetectorRef.detectChanges();
      } else {
        reader.onload = (_event: any) => {
          this.appIcon = _event.target.result
          this.ChangeDetectorRef.detectChanges();
        };
        reader.readAsDataURL(event.target.files[0]);
        this.appRef = this.BsModalService.show(this.appModal, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
      }
    };
  }

  confirmSplash() {
    let formdata = new FormData()
    formdata.append('file', this.splashFile)
    formdata.append('type', this.currentTab)
    this.AppsService.splashIcons(formdata).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails()
          this.splashRef?.hide()
          this.ToastrService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.error?.message)
      }
    })
  }

  declineSplash() {
    this.splashRef?.hide()
    this.getDetails()
  }

  confirmApp() {
    let formdata = new FormData()
    formdata.append('file', this.appFile)
    formdata.append('type', this.currentTab)
    this.AppsService.appIcons(formdata).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails()
          this.appRef?.hide()
          this.ToastrService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.error?.message)
      }
    })
  }

  declineApp() {
    this.appRef?.hide()
    this.getDetails()
  }

  detectChanges(type: any) {
    type == 'android' ? this.isAndroidDetected = true : this.isIosDetected = true
  }

  onCancel() {
    this.isSubmitted = false
    this.isAndroidDetected = false
    this.isIosDetected = false
    this.initForm()
    this.getDetails()
  }

  manageApps() {
    let payload = {
      android: { ...this.androidForm.value },
      ios: { ...this.iosForm.value }
    }

    this.AppsService.manageApps(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.splashFile = null
          this.splashIcon = null
          this.appFile = null
          this.appIcon = null
          this.isIosDetected = false
          this.isAndroidDetected = false
          this.getDetails()
          this.ToastrService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.error?.message)
      }
    })
  }
}
