import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { BlogService } from 'src/app/includes/services/blog.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

interface Media {
  title: string;
  _id: string;
  size: string;
  path: string;
  slug: string;
  tag: string;
  type: string;
  uploadedBy: string;
  uploadedDescription: string;
  uploadedTo: string;
  createdAt: string;
}

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.scss'],
})
export class UpdateBlogComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup;
  isSubmitted: boolean = false;
  previews: any = { thumbnail: '', cover: '' };
  files: any = { thumbnail: null, cover: null };
  blogDetails: any;
  blogQuery: string = '';
  modalRef: BsModalRef;
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
    placeholder: '',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'manrope', name: 'Manrope' },
      { class: 'sen', name: 'Sen' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
    ],
  };

  constructor(
    private BlogService: BlogService,
    private Router: Router,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute,
    private BsModalService: BsModalService
  ) {}

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      overview: new FormControl(''),
      isActive: new FormControl(true),
      isFeatured: new FormControl(false),
      category: new FormControl('', Validators.required),
      seoTitle: new FormControl(''),
      seoDescription: new FormControl(''),
      seoKeywords: new FormControl(''),
      canonicalUrl: new FormControl(''),
      thumbnail: new FormControl(null, Validators.required),
      cover: new FormControl(null),
    });

    this.blogQuery = this.ActivatedRoute.snapshot.params.blog || '';
    this.BlogService.blogDetails(this.blogQuery).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.blogDetails = res?.result;
          for (let key of Object.keys(this.blogDetails)) {
            this.form.get(key)?.setValue(this.blogDetails[key]);
          }
          this.previews.thumbnail = this.blogDetails.thumbnail?.path;
          this.previews.cover = this.blogDetails.cover?.path;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  handleCover(event: any) {
    this.previews.cover = event.path;
    this.form.get('cover')?.setValue(event?._id);
  }

  handleThumbnail(event: any) {
    this.previews.thumbnail = event.path;
    this.form.get('thumbnail')?.setValue(event?._id);
  }

  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'cover':
        this.form.get('cover')?.setValue(null);
        this.previews.cover = '';
        break;
      case 'thumbnail':
        this.form.get('thumbnail')?.setValue(null);
        this.previews.thumbnail = '';
        break;
    }
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-sm',
      ignoreBackdropClick: true,
    });
  }

  confirm() {
    this.BlogService.deleteBlog(this.blogQuery).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.blogs.list]);
          this.Toast.success(res.message);
          this.modalRef?.hide();
        } else {
          this.Toast.error(res.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err.error.message);
      },
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.Toast.error("Form validation failed")
      return;
    }

    this.BlogService.updateBlog({
      ...this.form.value,
      slug: this.blogQuery,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.blogs.list]);
          this.Toast.success(res.message);
        } else {
          this.Toast.error(res.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err.error.message);
      },
    });
  }
}
