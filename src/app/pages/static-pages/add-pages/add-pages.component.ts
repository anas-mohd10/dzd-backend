import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { appRoutes } from 'src/app/config/routes';
import { StaticPageService } from 'src/app/includes/services/static-page.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-pages',
  templateUrl: './add-pages.component.html',
  styleUrls: ['./add-pages.component.scss'],
})
export class AddPagesComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  viewModalRef?: BsModalRef;
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
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'manrope', name: 'Sen' },
      { class: 'Sen', name: 'Sen' },
      { class: 'poppins', name: 'Poppins' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
      { class: 'roboto', name: 'Roboto' },
      { class: 'sora', name: 'Sora' },
    ],
  };

  constructor(
    private Router: Router,
    private StaticPageService: StaticPageService,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private DomSanitizer: DomSanitizer
  ) {}

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
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

  getPreviewHtml(html: string): SafeHtml {
    if (!html) return '';
    
    // Create a complete HTML document with proper viewport and styling
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          /* Reset and base styles */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            background-color: #fff;
          }
          
          /* Responsive images */
          img {
            max-width: 100%;
            height: auto;
          }
          
          /* Responsive tables */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
          }
          
          /* Responsive iframes and embedded content */
          iframe, embed, object, video {
            max-width: 100%;
          }
          
          /* Ensure proper scaling on mobile devices */
          @media screen and (max-width: 768px) {
            body {
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
    
    return this.DomSanitizer.bypassSecurityTrustHtml(fullHtml);
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.StaticPageService.create(this.form.value).subscribe({
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
