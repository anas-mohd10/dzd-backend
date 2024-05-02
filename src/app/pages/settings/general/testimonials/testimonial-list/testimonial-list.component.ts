import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial-list.component.scss']
})
export class TestimonialListComponent implements OnInit {
  appRoute = appRoutes
  testimonials: Array<any> = []
  base: string = `${environment.base}/`;
  page: number = 1;
  limit: number = 20;
  totalResults: number = 0;
  totalPages: number = 1;
  months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  constructor(
    private TestimonialService: TestimonialService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.fetchData()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.fetchData()
  }

  fetchData() {
    this.TestimonialService.searchTestimonials({}, this.page, this.limit).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.testimonials = res?.result?.data
          this.page = res?.result?.page
          this.limit = res?.result?.limit
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  onSwitchTriggered(event: { switchId: string, toggleState: boolean }) {
    this.TestimonialService.updateTestimonial({ _id: event.switchId, isActive: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.fetchData()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  formatDate(date: string) {
    return `${this.months[new Date(date).getMonth()]} ${new Date(date).getDate()} ${new Date().getFullYear()}`
  }
}
