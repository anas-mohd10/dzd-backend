import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { StaticPageService } from 'src/app/includes/services/static-page.service';

@Component({
  selector: 'app-update-pages',
  templateUrl: './update-pages.component.html',
  styleUrls: ['./update-pages.component.scss']
})
export class UpdatePagesComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  details: any;
  staticPageId: any;
  modalRef?: BsModalRef;

  constructor(
    private Router: Router,
    private StaticPageService: StaticPageService,
    private HotToastService: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.staticPageId = this.ActivatedRoute.snapshot.queryParams.id || '';

    this.StaticPageService.details(this.staticPageId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.data;
          this.form.patchValue(this.details);
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      html: new FormControl('', Validators.required),
      styles: new FormControl(''),
      scripts: new FormControl(''),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl('')
    })
  }

  confirm() {
    this.StaticPageService.delete(this.staticPageId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([appRoutes.staticPages.list])
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    })
  }

  decline() {
    this.modalRef?.hide();
  }

  onDelete(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.StaticPageService.create(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([appRoutes.staticPages.list])
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    })
  }

}
