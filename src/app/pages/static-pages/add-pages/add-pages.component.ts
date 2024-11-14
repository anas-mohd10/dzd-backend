import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
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
      { class: 'sen', name: 'Sen' },
      { class: 'poppins', name: 'Poppins' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
      { class: 'roboto', name: 'Roboto' },
      { class: 'sora', name: 'Sora' },
    ],
  };

  constructor(
    private Router: Router,
    private StaticPageService: StaticPageService,
    private HotToastService: HotToastService
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
