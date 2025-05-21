import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BlogService } from 'src/app/includes/services/blog.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

interface Blog {
  _id: string;
  title: string;
  thumbnail: string;
  category: { title: string };
  createdAt: string;
  isDraft: boolean;
}

@Component({
  selector: 'app-blog-listing',
  templateUrl: './blog-listing.component.html',
  styleUrls: ['./blog-listing.component.scss'],
})
export class BlogListingComponent implements OnInit {
  settings: any;
  clear() {
    //clear the form
    this.keyword.setValue('')
    this.date = ''
  }
  appRoute = appRoutes
  keyword: FormControl = new FormControl('');
  date: string
  blogs: Blog[] = []
  pageIndex: number = 1
  pageSize: number = 20
  isLastPage: boolean = false
  totalResults: number = 0
  totalPages: number = 0
  modalRef: BsModalRef;
  categoryForm: FormGroup;
  categoryThumbnail: any;
  isActive: FormControl = new FormControl('');
  form: FormGroup = new FormGroup({
    blogPromotionalBanner: new FormControl('')
  });


  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private BlogService: BlogService,
    private modalService: BsModalService,
    private AppSettingsService: AppSettingsService,
  ) {
    this.categoryForm = new FormGroup({
      title: new FormControl('', Validators.required),
      thumbnail: new FormControl('', Validators.required)
    });
  }


  ngOnInit(): void {
    this.getBlogs();
    this.loadPromoBanner();

  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.getBlogs()
  }
  openCategoryModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  saveBlog(blog: any) {
    this.BlogService.updateBlog(blog).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.getBlogs();
        }
      }
    });
  }

  getBlogs() {
    this.BlogService.blogs({
      page: this.pageIndex,
      limit: this.pageSize,
      keyword: this.keyword.value,
      date: this.date,
      status: this.isActive.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.blogs = res.result.data;
          this.totalPages = res.result.totalPages;
          this.isLastPage = res.result.isLastPage;
          this.totalResults = res.result.totalResults;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  handleCategoryThumbnail(media: any) {
    console.log(media);
    this.categoryThumbnail = media.path;
    this.categoryForm.patchValue({ thumbnail: media._id });
  }

  createCategory() {
    if (this.categoryForm.valid) {
      this.BlogService.createCategory(this.categoryForm.value).subscribe({
        next: (res: any) => {
          if (res?.errorCode === 0) {
            this.modalRef.hide();
            // Show success message
          }
        }
      });
    }
  }

  loadPromoBanner() {
    // spread the remaining settings from the current settings object
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.form.patchValue({ blogPromotionalBanner: res.result.blogPromotionalBanner });
          console.dir(res, { depth: null })
          this.settings = res.result;
          this.form.patchValue({ blogPromotionalBanner: res.result.blogPromotionalBanner });
        }
      }
    });
  }
  open(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  close() {
    this.modalRef.hide();
  }

  handleThumbnail(media: any) {
    this.form.patchValue({ blogPromotionalBanner: media.path });
    this.settings.blogPromotionalBanner = media.path;
  }


  removePromoBanner() {
    this.form.get('blogPromotionalBanner')?.setValue('');
    this.settings.blogPromotionalBanner = null;
  }

  savePromo() {
    const updatedSettings = {
      ...this.settings,
      blogPromotionalBanner: this.form.value.blogPromotionalBanner
    };

    this.AppSettingsService.updateGeneralSettings(updatedSettings).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.modalRef.hide();
          this.settings = updatedSettings; // Update local settings
        }
      }
    });
  }

  removeCategoryThumbnail() {
    this.categoryThumbnail = null;
    this.categoryForm.patchValue({ thumbnail: null });
  }
}


