import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
})
export class CollectionListComponent implements OnInit {
  appRoute = appRoutes;
  base: any = environment.base
  form: FormGroup;
  collections: Array<any> = [];
  page: number = 1
  limit: number = 20
  isLastPage: boolean = false
  totalResults: number = 0
  totalPages: number = 1
  keyword: FormControl = new FormControl("")
  isActive: FormControl = new FormControl("")
  isExporting: boolean = false;

  constructor(
    private CollectionService: CollectionService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.getCollections()
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  formatTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  clearFilters() {
    this.keyword.setValue("")
    this.isActive.setValue("")
    this.getCollections()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getCollections()
  }

  getCollections() {
    this.CollectionService.searchCollection({
      keyword: this.keyword?.value,
      isActive: this.isActive?.value, isArchive: false,
      page: this.page, limit: this.limit
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.collections = res?.result?.data
          this.isLastPage = res?.result?.isLastPage
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }

  exportCollections() {
    if (this.isExporting) return;
    
    this.isExporting = true;
    this.ToastrService.info('Preparing collections export...');
    
    this.CollectionService.exportCollections().subscribe({
      next: (res: any) => {
        this.isExporting = false;
        if (res?.errorCode == 0 && res?.result?.url) {
          // Create a temporary link and trigger download
          const link = document.createElement('a');
          link.href = res.result.url;
          link.target = '_blank';
          link.download = 'collections-export.csv';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          this.ToastrService.success('Collections exported successfully');
        } else {
          this.ToastrService.error(res.message || 'Failed to export collections');
        }
      },
      error: (err: any) => {
        this.isExporting = false;
        this.ToastrService.error(err.message || 'Failed to export collections');
      }
    });
  }
}
