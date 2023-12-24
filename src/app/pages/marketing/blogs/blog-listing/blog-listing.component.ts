import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { BlogService } from 'src/app/includes/services/blog.service';

@Component({
  selector: 'app-blog-listing',
  templateUrl: './blog-listing.component.html',
  styleUrls: ['./blog-listing.component.scss']
})
export class BlogListingComponent implements OnInit {
  appRoute = appRoutes
  keyword: FormControl = new FormControl('');
  date: string
  blogs: Array<any> = []
  page: number = 1
  limit: FormControl = new FormControl('16')
  isLastPage: boolean = false
  totalResults: number = 0
  totalPages: number = 0

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private BlogService: BlogService
  ) { }

  ngOnInit(): void {
    this.getBlogs()
  }

  next() {
    this.page += 1
    this.getBlogs()
  }

  previous() {
    this.page -= 1
    this.getBlogs()
  }

  getBlogs() {
    this.BlogService.blogs({
      page: this.page,
      limit: this.limit.value,
      keyword: this.keyword.value,
      date: this.date
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.blogs = res.result.data
          this.totalPages = res.result?.totalPages
          this.isLastPage = res.result.isLastPage
          this.totalResults = res.result.totalResults
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }


}
