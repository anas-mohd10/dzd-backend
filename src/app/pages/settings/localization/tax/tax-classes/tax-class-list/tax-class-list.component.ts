import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tax-class',
  templateUrl: './tax-class-list.component.html',
  styleUrls: ['./tax-class-list.component.scss'],
})
export class TaxClassComponent implements OnInit {
  classDetails: Array<any> = []
  keyword: FormControl = new FormControl('')
  limit: number = 10
  isLastPage: boolean = true
  page: number = 1
  appRoute = appRoutes
  modalRef?: BsModalRef
  class: any = {}
  totalResults: number = 0
  totalPages: number = 1

  constructor(
    private TaxClassesService: TaxClassesService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getClass()
  }

  open(template: TemplateRef<any>, classItem: any) {
    this.class = classItem
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' })
  }

  confirm() {
    this.TaxClassesService.deleteClass(this.class?.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getClass()
          this.modalRef?.hide()
          this.ToastrService.success(res.message);
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message);
      }
    })
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getClass()
  }

  getClass() {
    this.TaxClassesService.searchClass({
      keyword: this.keyword.value,
      limit: this.limit,
      page: this.page
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.classDetails = res?.result?.data;
          this.totalResults = res?.result?.totalResults;
          this.totalPages = res?.result?.totalPages;
          this.isLastPage = res?.result?.isLastPage;
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
