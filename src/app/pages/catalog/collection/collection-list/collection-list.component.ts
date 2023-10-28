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
  limit: FormControl = new FormControl(20)
  isLastPage: boolean = false
  totalResults: string = ''
  totalPages: string = ''

  constructor(
    private CollectionService: CollectionService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.getCollections()
  }

  initForm() {
    this.form = new FormGroup({
      keyword: new FormControl(''),
      isActive: new FormControl(''),
      isFeatured: new FormControl(''),
    });
  }

  clearFilters() {
    this.initForm()
    this.getCollections()
  }

  getNextPage() {
    this.page += 1
    this.getCollections()
  }

  getPreviousPage() {
    this.page -= 1
    this.getCollections()
  }

  getCollections() {
    let payload = {
      ...this.form.value,
      isArchive: false,
      page: this.page,
      limit: this.limit.value
    }

    this.CollectionService.searchCollection(payload).subscribe({
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

}
