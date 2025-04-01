import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { StaticPageService } from 'src/app/includes/services/static-page.service';

@Component({
  selector: 'app-update-pages',
  templateUrl: './update-pages.component.html',
  styleUrls: ['./update-pages.component.scss'],
})
export class UpdatePagesComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  details: any;
  staticPageId: any;
  modalRef?: BsModalRef;
  viewModalRef?: BsModalRef;
  metaThumbnail: string = '';
  
  editorOptions = {
    theme: 'vs-light',
    language: 'html',
    automaticLayout: true,
    minimap: {
      enabled: true
    },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    roundedSelection: true,
    fontSize: 14,
    wordWrap: 'on',
    folding: true,
    formatOnPaste: true,
    formatOnType: true,
  };

  constructor(
    private Router: Router,
    private StaticPageService: StaticPageService,
    private HotToastService: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private DomSanitizer: DomSanitizer,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) {}

  get formControls() {
    return this.form.controls;
  }

  onMediaClicked(event: any) {
    this.form.patchValue({ metaThumbnail: event?._id });
  }

  onMediaRemoved() {
    this.form.patchValue({ metaThumbnail: null });
  }

  openViewTemplate(template: TemplateRef<any>) {
    this.viewModalRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
  }
  

  getSanitizedHtml(html: string): SafeHtml {
    if (!html) return '';
    return this.DomSanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit(): void {
    this.staticPageId = this.ActivatedRoute.snapshot.queryParams.id || '';

    this.StaticPageService.details(this.staticPageId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result;
          this.metaThumbnail =
            res?.result?.metaThumbnail && res?.result?.metaThumbnail.path;
          this.form.patchValue(this.details);
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => {},
    });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      slug: new FormControl(''),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
      metaThumbnail: new FormControl(null),
    });
  }

  confirm() {
    this.StaticPageService.delete(this.staticPageId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.modalRef?.hide();
          this.HotToastService.success(res?.message);
          this.Router.navigate([appRoutes.staticPages.list]);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });
  }

  decline() {
    this.modalRef?.hide();
  }

  onDelete(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.StaticPageService.update({
      _id: this.details?._id,
      slug: this.details.slug,
      ...this.form.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([appRoutes.staticPages.list]);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });
  }
}
