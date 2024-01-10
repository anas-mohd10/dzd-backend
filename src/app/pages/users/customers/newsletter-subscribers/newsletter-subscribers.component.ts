import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-newsletter-subscribers',
  templateUrl: './newsletter-subscribers.component.html',
  styleUrls: ['./newsletter-subscribers.component.scss']
})

export class NewsletterSubscribersComponent implements OnInit {
  appRoute = appRoutes
  page: number = 1
  limit: number = 100
  totalPages: number = 1
  totalResults: number = 0
  keyword: FormControl = new FormControl('')
  emails: Array<any> = []
  exportUrl: string = environment.baseUrl + "admin/auth/export-newsletter-subscribers"

  constructor(
    private CustomersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.getSubscribers()
  }

  clear() {
    this.keyword.reset()
    this.getSubscribers()
  }

  onPageTriggered(event: { pageSize: number, pageIndex: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getSubscribers()
  }

  getSubscribers() {
    this.CustomersService.getNewsletterSubscribers(this.page, this.limit, this.keyword?.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.emails = res?.result?.data
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.message)
      }
    })
  }
}
