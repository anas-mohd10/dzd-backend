import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { CollectionService } from "src/app/includes/services/collection.service";

@Component({
  selector: 'app-bulk-file-upload',
  templateUrl: './bulk-file-upload.component.html',
  styleUrls: ['./bulk-file-upload.component.scss']
})
export class BulkFileUploadComponent implements OnInit {
  pageTitle: any
  pageType: any
  filedata: any
  isUploaded: Boolean = false
  filename: any;
  filesize: any;
  filestring: any;
  isTriggered: boolean = false;
  isValidFile: boolean = true
  isValidExtension: boolean = false

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private BrandService: BrandService,
    private ToastrService: ToastrService,
    private CategoryService: CategoryService,
    private ProductService: ProductService,
    private CollectionService: CollectionService
  ) { }

  ngOnInit(): void {
    this.pageType = this.ActivatedRoute.snapshot.queryParams.type || null
    switch (this.pageType) {
      case 'category':
        this.pageTitle = 'Category File Bulk Upload'
        break
      case 'brand':
        this.pageTitle = 'Brand File Bulk Upload'
        break
      case 'collection':
        this.pageTitle = 'Collection File Bulk Upload'
        break
      case 'product':
        this.pageTitle = 'Product File Bulk Upload'
        break
      case 'users':
        this.pageTitle = 'Users File Bulk Upload'
        break
    }
  }

  fileUpload(event: any) {
    let extensionCheck: boolean = event.files[0]?.name.toLowerCase().endsWith('.csv');
    if (extensionCheck) {
      this.filedata = event.files[0]
      this.filename = this.filedata.name
      this.filesize = this.filedata.size / 1024

      const reader = new FileReader();
      reader.readAsDataURL(this.filedata);
      reader.onload = () => {
        this.filestring = reader.result
      };

      if (this.filesize > 50) this.isValidFile = false
      if (this.filedata) this.isUploaded = true
      this.isValidExtension = false
    } else {
      this.isValidExtension = true
    }
  }

  removeFileUpload() {
    this.filedata = null
    this.isUploaded = false
    this.isValidFile = true
  }

  navigateBack() {
    window.history.back()
  }

  bulkUpload() {
    let formdata = new FormData()
    formdata.append("file", this.filedata)
    if (this.isValidFile) {
      switch (this.pageType) {
        case 'category':
          this.isTriggered = true
          this.CategoryService.bulkFileUpload(formdata).subscribe((res: any) => {
            this.getResults(res?.errorCode, res?.message)
          })
          break
        case 'brand':
          this.isTriggered = true
          this.BrandService.bulkFileUpload(formdata).subscribe((res: any) => {
            this.getResults(res?.errorCode, res?.message)
          })
          break
        case 'collection':
          this.isTriggered = true
          this.CollectionService.bulkFileUpload(formdata).subscribe((res: any) => {
            this.getResults(res?.errorCode, res?.message)
          })
          break
        case 'product':
          this.ProductService.bulkFileUpload(formdata).subscribe((res: any) => {
            this.getResults(res?.errorCode, res?.message)
          })
          break
        case 'users':
          break
      }
    } else {

    }
  }

  getResults(errorCode: any, message: any) {
    if (errorCode == 0) {
      this.isTriggered = false
      window.history.back()
      this.ToastrService.success(message)
    } else {
      this.isTriggered = false
      this.ToastrService.error(message)
    }
  }
}
