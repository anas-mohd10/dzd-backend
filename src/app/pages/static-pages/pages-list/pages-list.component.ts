import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { StaticPageService } from 'src/app/includes/services/static-page.service';

@Component({
  selector: 'app-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent implements OnInit {
  appRoute = appRoutes;
  staticPages: Array<any> = [];
  page: number = 1;
  limit: number = 30;
  totalResults: number = 0;
  totalPages: number = 1;
  keyword: FormControl = new FormControl('');
  months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  constructor(
    private StaticPageService: StaticPageService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchData()
  }

  onPageTriggered(event: {pageIndex: number, pageSize: number}){
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.fetchData()
  }

  onSwitchToggled(event: { switchId: string, toggleState: boolean }) {
    this.StaticPageService.update({ _id: event.switchId, isActive: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.fetchData()
          this.HotToastService.success(res?.message);
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    })
  }

  setKeyword(){
    setTimeout(() => {
      this.fetchData()
    }, 800)
  }

  formatDate(date: string) {
    return `${this.months[new Date(date).getMonth()]} ${new Date(date).getDate()} ${new Date().getFullYear()}`
  }
  
  fetchData() {
    this.StaticPageService.search(this.keyword.value, this.page, this.limit).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.staticPages = res?.result?.data;
          this.totalResults = res?.result?.totalResults;
          this.totalPages = res?.result?.totalPages;
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    })
  }

}
