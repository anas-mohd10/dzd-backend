import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { ProjectService } from 'src/app/includes/services/project.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { debounceTime } from 'rxjs/operators';
import slugify from 'slugify';
interface ProjectCategory {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  isActive: boolean;
}

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})


export class CreateProjectComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup;
  isSubmitted: boolean = false;
  previews: any = { thumbnail: '', cover: '', authorThumbnail: '' };
  files: any = { thumbnail: null, cover: null, authorThumbnail: null };

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
    sanitize: false,
    toolbarHiddenButtons: [['fontName']]
  };

  cover: string = '';
  thumbnail: string = '';
  categories: ProjectCategory[] = [];
  slug: string = '';
  authorThumbnail: string = '';

  constructor(
    private ProjectService: ProjectService,
    private Router: Router,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      slug: new FormControl(''),
      overview: new FormControl(''),
      description: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      isFeatured: new FormControl(false),
      isDraft: new FormControl(true),
      author: new FormControl(''),
      authorThumbnail: new FormControl(null),
      category: new FormControl(''),
      seoTitle: new FormControl(''),
      seoDescription: new FormControl(''),
      seoKeywords: new FormControl(''),
      canonicalUrl: new FormControl(''),
      thumbnail: new FormControl(null, Validators.required),
      cover: new FormControl(null),
    });

    this.form.get("title")?.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      const slug: string = slugify(
        this.form.get('title')?.value, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
        trim: true
      })

      this.form.get('slug')?.setValue(slug);
      this.ChangeDetectorRef.markForCheck()
    })
  }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.ProjectService.getCategories().subscribe({
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

  handleAuthorThumbnail(event: any) {
    this.authorThumbnail = event.path;
    this.form.get('authorThumbnail')?.setValue(event?._id);
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
      case 'authorThumbnail':
        this.form.get('authorThumbnail')?.setValue(null);
        this.authorThumbnail = '';
        break;
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.ProjectService.createProject({
      ...this.form.value,
      category: {
        title: this.categories.find(category => category._id === this.form.value.category)?.title,
        thumbnail: this.categories.find(category => category._id === this.form.value.category)?.thumbnail
      }
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.projects.list]);
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
    this.ProjectService.getCategories().subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.categories = res.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    });
  }
}
