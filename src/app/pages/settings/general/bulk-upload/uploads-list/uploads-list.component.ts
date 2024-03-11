import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CsvService } from 'src/app/includes/services/csv.service';
import { ProductService } from 'src/app/includes/services/product.service';

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
  types: Array<{ title: string, type: string }> = [
    { title: 'Category', type: 'category' },
    { title: 'Product', type: 'product' },
    { title: 'Brand', type: 'brand' },
    { title: 'Collection', type: 'collection' }
  ];
  fileData: any;
  fileName: string;
  fileSize: number;
  file: FormControl = new FormControl("")
  importType: FormControl = new FormControl("", Validators.required)
  isFile: boolean = false

  constructor(
    private CsvService: CsvService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private CategoryService: CategoryService,
    private BrandService: BrandService,
    private HotToastService: HotToastService,
    private CollectionService: CollectionService,
    private ProductService: ProductService
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

  handleFileUpload(event: any) {
    let extensionCheck: boolean = event.files[0]?.name.toLowerCase().endsWith('.csv');
    if (extensionCheck) {
      this.fileData = event.files[0];
      this.fileName = this.fileData.name;
      this.fileSize = this.fileData.size / 1024
    } else {
      this.HotToastService.error("Please upload a CSV file")
    }
  }

  closeFileUpload() {
    this.fileData = null
    this.fileName = ''
    this.fileSize = 0
  }

  upload() {
    let formdata = new FormData()
    formdata.append("file", this.fileData)
    if (this.isFile) {
      switch (this.importType.value) {
        case 'category':
          this.CategoryService.bulkFileUpload(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {

              } else {

              }
            }
          })
          break
        case 'brand':
          this.BrandService.bulkFileUpload(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {

              } else {

              }
            }
          })
          break
        case 'collection':
          this.CollectionService.bulkFileUpload(formdata).subscribe((res: any) => {
            next: (res: any) => {
              if (res?.errorCode == 0) {

              } else {

              }
            }
          })
          break
        case 'product':
          this.ProductService.bulkFileUpload(formdata).subscribe((res: any) => {
            next: (res: any) => {
              if (res?.errorCode == 0) {

              } else {

              }
            }
          })
          break
        case 'users':
          break
      }
    } else {

    }
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
