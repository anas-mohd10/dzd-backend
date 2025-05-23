import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BlogService } from 'src/app/includes/services/blog.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit, OnChanges {
  widgetBlog: FormControl = new FormControl('');
  blogs: Array<any> = [];
  blogsMap: any = {};
  widgetBlogs: Array<any> = [];
  @Output() widgetBlogsChange = new EventEmitter<Array<any>>();
  @Input() widgetBlogItems: Array<any> = [];

  constructor(
    private BlogService: BlogService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.widgetBlogs = [...this.widgetBlogItems];
  }

  ngOnInit(): void {
    this.getBlogs('')
  }

  saveBlogs() {
    let blogItem = this.blogsMap[this.widgetBlog.value]
    if (this.widgetBlogs.length == 10) {
      this.widgetBlog.setValue('')
      this.HotToastService.error('Maximum blogs limit reached')
      return
    }

    this.widgetBlogs.push(blogItem)
    this.widgetBlog.setValue('')
    this.getBlogs('')
    this.widgetBlogsChange.emit(this.widgetBlogs)
    this.HotToastService.success('Blog added successfully')
  }

  dropBlogs(event: any) {
    let items = [...this.widgetBlogs];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.widgetBlogs = [...items];
    this.widgetBlogsChange.emit(this.widgetBlogs)
  }

  removeBlog(blogIndex: number) {
    this.widgetBlogs.splice(blogIndex, 1)
    this.getBlogs('')
    this.widgetBlogsChange.emit(this.widgetBlogs)
    this.HotToastService.info('Blog removed successfully')
  }

  getBlogs(query: string) {
    const blogIds: string[] = this.widgetBlogs.map((blog: any) => blog?._id);
    this.BlogService.blogs({
      keyword: query,
      page: 1,
      limit: 100,
      blogIds
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.blogs = res?.result?.data;
          if (res.result.data && res.result.data.length > 0) {
            res.result.data.map((blog: any) => {
              this.blogsMap[blog.slug] = blog;
            })
          }
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }
}
