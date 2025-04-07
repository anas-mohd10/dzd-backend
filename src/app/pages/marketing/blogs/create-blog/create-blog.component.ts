import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { BlogService } from 'src/app/includes/services/blog.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
interface BlogCategory {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  isActive: boolean;
}

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})


export class CreateBlogComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup;
  isSubmitted: boolean = false;
  previews: any = { thumbnail: '', cover: '' };
  files: any = { thumbnail: null, cover: null };
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
      { class: 'manrope', name: 'Sen' },
      { class: 'Sen', name: 'Sen' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
    ],
  };
  cover: string = '';
  thumbnail: string = '';
  categories: BlogCategory[] = [];
  slug: string = '';


  constructor(
    private BlogService: BlogService,
    private Router: Router,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    console.log('heeey')
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      slug: new FormControl('', Validators.required),
      overview: new FormControl(''),
      description: new FormControl('', Validators.required),
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
    this.BlogService.getCategories().subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.categories = res.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    });
  }

  handleCover(event: any) {
    this.cover = event.path;
    this.form.get('cover')?.setValue(event?._id);
  }

  handleThumbnail(event: any) {
    this.thumbnail = event.path;
    this.form.get('thumbnail')?.setValue(event?._id);
  }

  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'cover':
        this.form.get('cover')?.setValue(null);
        this.cover = '';
        break;
      case 'thumbnail':
        this.form.get('thumbnail')?.setValue(null);
        this.thumbnail = '';
        break;
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.BlogService.createBlog({
      ...this.form.value,
      category: {
        title: this.categories.find(category => category._id === this.form.value.category)?.title,
        thumbnail: this.categories.find(category => category._id === this.form.value.category)?.thumbnail
      }
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

  loadCategories() {
    this.BlogService.getCategories().subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.categories = res.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    });
  }
}
