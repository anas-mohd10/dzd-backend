import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { PopupService } from 'src/app/includes/services/popup.service';

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
  form: FormGroup = new FormGroup({})

  constructor(
    private PopupService: PopupService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getDetails()
    this.form = new FormGroup({
      website: new FormControl(""),
      websiteRedirection: new FormControl(""),
      mobile: new FormControl(""),
      mobileRedirection: new FormControl(""),
      app: new FormControl(""),
      appRedirection: new FormControl(""),
    })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  onMediaClicked(event: any, type: string) {
    this.form.get(type)?.setValue(event.path)
  }

  onMediaRemoved(type: string) {
    this.form.get(type)?.setValue('')
    this.form.get(`${type}Redirection`)?.setValue('')
  }

  close() {
    this.modalRef?.hide()
  }

  getDetails() {
    this.PopupService.popupDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result
          this.form.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  onSubmit() {
    this.PopupService.managePopup(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.getDetails()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }
}
