import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BlogService } from 'src/app/includes/services/blog.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-blog-listing',
  templateUrl: './blog-listing.component.html',
  styleUrls: ['./blog-listing.component.scss'],
})
export class BlogListingComponent implements OnInit {
  clear() {
    //clear the form
    this.keyword.setValue('')
    this.date = ''
  }
  appRoute = appRoutes
  keyword: FormControl = new FormControl('');
  date: string
  blogs: Array<any> = []
  page: number = 1
  limit: number = 20
  isLastPage: boolean = false
  totalResults: number = 0
  totalPages: number = 0
  modalRef: BsModalRef;
  categoryForm: FormGroup;
  categoryThumbnail: any;
  isActive: FormControl = new FormControl('');


  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private BlogService: BlogService,
    private modalService: BsModalService
  ) {
    this.categoryForm = new FormGroup({
      title: new FormControl('', Validators.required),
      thumbnail: new FormControl('', Validators.required)
    });
  }


  ngOnInit(): void {
    this.getBlogs();
  }

  onPageTriggered(event: any) {
    this.page = event.pageIndex
    this.limit = event.pageSize
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
      page: this.page,
      limit: this.limit,
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

  removeCategoryThumbnail() {
    this.categoryThumbnail = null;
    this.categoryForm.patchValue({ thumbnail: null });
  }
}
