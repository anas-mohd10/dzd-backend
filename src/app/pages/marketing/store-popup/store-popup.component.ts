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
  filedata: any
  preview: any
  file: FormControl = new FormControl('')
  redirection: FormControl = new FormControl('')
  isVisible: FormControl = new FormControl("false")
  previewRef?: BsModalRef
  @ViewChild('previewTemplate') previewTemplate: TemplateRef<any>

  constructor(
    private PopupService: PopupService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private BsModalService: BsModalService,
    private BsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.getDetails()
  }

  open(template: TemplateRef<any>) {
    this.previewRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
  }

  addMedia(event: any) {
    this.filedata = event?.target?.files[0]
    let reader = new FileReader();
    reader.onload = (e: any) => { this.preview = e.target.result };
    reader.readAsDataURL(this.filedata);
    this.open(this.previewTemplate)
  }

  removeMedia() {
    this.file.setValue('')
    this.filedata = null
    this.preview = null
  }

  getDetails() {
    this.PopupService.popupDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.data
          this.isVisible.setValue(this.details?.isVisible)
          this.details?.file ? this.preview = environment.base + '/' + this.details?.file : null
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
    this.filedata ? formdata.append('file', this.filedata) : null
    formdata.append('isVisible', this.isVisible.value)
  }
}
