import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { SitemapService } from 'src/app/includes/services/sitemap.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  appRoute = appRoutes
  sitemapDetails: any;
  modalRef?: BsModalRef
  form: FormGroup
  isSubmitted: boolean = false;
  editorOptions = { theme: 'vs-dark', language: 'html' };

  constructor(
    private BsModalService: BsModalService,
    private SitemapService: SitemapService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Toast: HotToastService
  ) { }

  get formControls() {
    return this.form.controls
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  ngOnInit(): void {
    this.getDetails()
    this.form = new FormGroup({
      sitemap: new FormControl('', Validators.required),
      isEnabled: new FormControl('false')
    })
  }

  getDetails() {
    this.SitemapService.shippingDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.sitemapDetails = res?.result
          this.form.patchValue(this.sitemapDetails)
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  confirm() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.SitemapService.createSitemap(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails()
          this.modalRef?.hide()
          this.Toast.success(res?.message)
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err) => {
        this.Toast.error(err.error?.message)
      }
    })
  }

}
