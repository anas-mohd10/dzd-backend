import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { ReturnsService } from 'src/app/includes/services/returns.service';

@Component({
  selector: 'app-return-list',
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.scss']
})
export class ReturnListComponent implements OnInit {
  appRoute = appRoutes
  page: number = 1
  limit: number = 20
  totalResults: number = 0
  totalPages: number = 1
  keyword: FormControl = new FormControl('')
  startDate: string
  endDate: string
  returns: Array<any> = []

  constructor(
    private ReturnsService: ReturnsService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getReturns()
  }

  onPageTriggered(event: any) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getReturns()
  }

  clear(){
    this.keyword.setValue('')
    this.startDate = ''
    this.endDate = ''
    this.page = 1
    this.limit = 20
    this.getReturns()
  }

  getReturns() {
    this.ReturnsService.getReturns({
      page: this.page,
      limit: this.limit,
      keyword: this.keyword.value,
      startDate: this.startDate,
      endDate: this.endDate,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.returns = res?.result?.data
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.ChangeDetectorRef.detectChanges()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
}
