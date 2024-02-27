import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { ReplaceRequestsService } from 'src/app/includes/services/replace-requests.service';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent implements OnInit {
  appRoute = appRoutes;
  replaceRequests: Array<any> = []
  page: number = 1
  limit: number = 10
  totalResults: number = 0
  totalPages: number = 1
  status: FormControl = new FormControl('');
  startDate: string;
  endDate: string;

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ReplaceRequestsService: ReplaceRequestsService
  ) { }

  ngOnInit(): void {
    this.getReplaceRequests()
  }

  onPageTriggered(event: { pageSize: number, pageIndex: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getReplaceRequests()
  }

  clearFilters() {
    this.status.setValue('')
    this.startDate = ''
    this.endDate = ''
    this.getReplaceRequests()
    this.ChangeDetectorRef.markForCheck()
  }

  getReplaceRequests() {
    this.ReplaceRequestsService.getReplaceRequests({
      page: this.page, limit: this.limit, status: this.status.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.replaceRequests = res?.result?.data
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

}
