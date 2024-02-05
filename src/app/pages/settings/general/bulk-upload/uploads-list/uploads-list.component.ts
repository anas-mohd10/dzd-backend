import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { CsvService } from 'src/app/includes/services/csv.service';

@Component({
  selector: 'app-uploads-list',
  templateUrl: './uploads-list.component.html',
  styleUrls: ['./uploads-list.component.scss']
})
export class UploadsListComponent implements OnInit {
  appRoute = appRoutes
  fileImports: Array<any> = []
  form: FormGroup
  isLastPage: boolean = false
  totalPages: number = 0
  totalResults: number = 0
  page: number = 1
  limit: number = 20
  modalRef?: BsModalRef
  importForm: FormGroup

  constructor(
    private CsvService: CsvService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true })
  }

  close() {
    this.modalRef?.hide()
    this.importForm.patchValue({ import: "images", type: "others" })
  }

  toggleImportParams(type: string, params: string) {
    this.importForm.patchValue({ [type]: params })
  }

  ngOnInit(): void {
    this.importForm = new FormGroup({
      import: new FormControl("images"),
      type: new FormControl("others"),
    })

    this.form = new FormGroup({
      createdAt: new FormControl(""),
      status: new FormControl("")
    })

    this.getFileImports()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getFileImports()
  }

  clearFilters() {
    this.form.reset()
  }

  getFileImports() {
    this.CsvService.getFileImports({ page: this.page, limit: this.limit, ...this.form.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.fileImports = res?.result?.data
          this.isLastPage = res?.result?.isLastPage
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }
}
