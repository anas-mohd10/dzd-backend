import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { SeoService } from 'src/app/includes/services/seo.service';

@Component({
  selector: 'app-seo-details',
  templateUrl: './seo-details.component.html',
  styleUrls: ['./seo-details.component.scss']
})
export class SeoDetailsComponent implements OnInit {
  appRoute = appRoutes
  seoDetails: any = []
  form: FormGroup
  isSubmitted: boolean = false;
  modalRef?: BsModalRef;
  isEditMode: boolean = false
  thumbnail: string = ''

  constructor(
    private SeoService: SeoService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  get formControls() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      page: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      type: new FormControl('create'),
      thumbnail: new FormControl(null),
      title: new FormControl('', Validators.required),
      keywords: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    })
    
    this.fetchSeoDetails()
  }

  handleThumbnail(event: any) {
    this.form.patchValue({ thumbnail: event?._id })
    this.thumbnail = event?.path
  }

  removeThumbnail() {
    this.form.patchValue({ thumbnail: null })
    this.thumbnail = ''
  }

  fetchSeoDetails() {
    this.SeoService.getSeoDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.seoDetails = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  getSeoDetails(seo: any) {
    this.SeoService.getSeoDetailsById(seo).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result)
          this.thumbnail = res?.result?.thumbnail?.path
          this.form.patchValue({ thumbnail: res?.result?.thumbnail?._id })
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  close() {
    this.form.reset()
    this.form.get('page')?.setValue('')
    this.thumbnail = ''
    this.modalRef?.hide()
    this.isEditMode = false
    this.isSubmitted = false
  }

  open(template: TemplateRef<any>, seoId?: string) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered' });
    seoId ? this.getSeoDetails(seoId) : null
    if (seoId) {
      this.isEditMode = true
      this.form.patchValue({ type: 'update' })
    } else {
      this.form.patchValue({ type: 'create' })
    }
  }

  delete() {
    this.SeoService.manageSeoDetails({ ...this.form.value, isDelete: true }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.close()
          this.fetchSeoDetails()
          this.form.reset()
          this.form.patchValue({ page: "" })
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  manageDetails() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.SeoService.manageSeoDetails(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.close()
          this.fetchSeoDetails()
          this.form.reset()
          this.form.patchValue({ page: "" })
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    }
    )
  }
}