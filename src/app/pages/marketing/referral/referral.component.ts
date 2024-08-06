import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ReferralService } from 'src/app/includes/services/referral.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  appRoute = appRoutes
  referralProgram: any
  invitedCustomers: Array<any> = []
  page: number = 1
  limit: number = 20
  totalPages: number = 1
  totalResults: number = 0
  form: FormGroup
  modalRef?: BsModalRef
  settings: any;
  keyword: FormControl = new FormControl('')
  isSubmitted: boolean = false

  constructor(
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Toast: HotToastService,
    private ReferralService: ReferralService,
    private AppSettingsService: AppSettingsService
  ) { }

  get formControls() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      welcomeBonus: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+$")]),
      referralBonus: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+$")]),
      minimumPurchase: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+$")]),
      isWalletEnabled: new FormControl('false'),
      minimumCartAmount: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+$")]),
      isReferralEnabled: new FormControl('false'),
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })

    this.getReferralProgram()
    this.getInvitedCustomers()
  }

  getReferralProgram() {
    this.ReferralService.referralProgram().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.referralProgram = res?.result
          this.form.patchValue(this.referralProgram)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.message)
      }
    })
  }

  switchToggled(event: { switchId: string, toggleState: boolean }) {
    this.form.patchValue({ [event.switchId]: event.toggleState })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true })
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getInvitedCustomers()
  }

  clear() {
    this.page = 1
    this.limit = 20
    this.keyword.reset()
    this.getInvitedCustomers()
  }

  getInvitedCustomers() {
    this.ReferralService.getInvitedCustomers({
      page: this.page,
      limit: this.limit, keyword: this.keyword.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.invitedCustomers = res?.result?.data
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.message)
      }
    })
  }

  manageReferral() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.ReferralService.manageReferral(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getReferralProgram()
          this.modalRef?.hide()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.message)
      }
    })
  }
}
