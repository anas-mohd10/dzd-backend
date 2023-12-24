import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { BlogService } from 'src/app/includes/services/blog.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss']
})
export class CreateBlogComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup;
  isSubmitted: boolean = false
  previews: any = { thumbnail: '', cover: '' }
  files: any = { thumbnail: null, cover: null }
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
    ]
  };

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
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      category: new FormControl('', Validators.required),
      seoTitle: new FormControl(''),
      seoDescription: new FormControl(''),
      seoKeywords: new FormControl(''),
      canonicalUrl: new FormControl(''),
    })
  }

  handleThumbnail(event: any) {
    this.files.thumbnail = event?.target?.files[0]
    let reader = new FileReader();
    reader.onload = (e: any) => { this.previews.thumbnail = e.target.result };
    reader.readAsDataURL(this.files.thumbnail);
    this.ChangeDetectorRef.detectChanges()
  }

  handleCover(event: any) {
    this.files.cover = event?.target?.files[0]
    let reader = new FileReader();
    reader.onload = (e: any) => { this.previews.cover = e.target.result };
    reader.readAsDataURL(this.files.cover);
    this.ChangeDetectorRef.detectChanges()
  }

  removeMedia(type?: string) {
    if (type == 'thumbnail') {
      this.previews.thumbnail = ''
      this.files.thumbnail = null
      this.ChangeDetectorRef.detectChanges()
      return;
    } else if (type == 'cover') {
      this.previews.cover = ''
      this.files.cover = null
      this.ChangeDetectorRef.detectChanges()
      return;
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    let formdata = new FormData()
    for (let key of Object.keys(this.form.value)) formdata.append(key, this.form.value[key])
    this.files.thumbnail && formdata.append('thumbnail', this.files.thumbnail)
    this.files.cover && formdata.append('cover', this.files.cover)
    this.BlogService.createBlog(formdata).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.blogs.list])
          this.Toast.success(res.message)
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.error.message)
      }
    })
  }
}
