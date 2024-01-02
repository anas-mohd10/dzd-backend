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
  limit: number = 20
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

  onPageTriggered(event: any) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getBlogs()
  }

  clear() {
    this.keyword.setValue('')
    this.date = ''
    this.getBlogs()
  }

  getBlogs() {
    this.BlogService.blogs({
      page: this.page,
      limit: this.limit,
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
