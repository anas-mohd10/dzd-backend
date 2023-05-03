import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-bulk-media-upload',
  templateUrl: './bulk-media-upload.component.html',
  styleUrls: ['./bulk-media-upload.component.scss']
})
export class BulkMediaUploadComponent implements OnInit {
  pageTitle: any
  pageType: any
  images: Array<File> = []
  previewImages: Array<any> = []
  isUploaded: Boolean = false
  filename: any;
  filesize: any;
  filestring: any;
  isTriggered: boolean = false;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private BrandService: BrandService,
    private ToastrService: ToastrService,
    private CategoryService: CategoryService,
    private ProductService: ProductService
  ) { }

  ngOnInit(): void {
    this.pageType = this.ActivatedRoute.snapshot.queryParams.type || null
    switch (this.pageType) {
      case 'category':
        this.pageTitle = 'Category Media Bulk Upload'
        break
      case 'brand':
        this.pageTitle = 'Brand Media Bulk Upload'
        break
      case 'collection':
        this.pageTitle = 'Collection Media Bulk Upload'
        break
      case 'product':
        this.pageTitle = 'Product Media Bulk Upload'
        break
      case 'product-thumbnails':
        this.pageTitle = 'Product Thumbnails Media Bulk Upload'
        break
    }
  }

  fileUpload(event: any) {
    this.images = <Array<File>>event.files;
    this.isUploaded = true
  }

  removeFileUpload() {
  }

  bulkUpload() {
    let formdata = new FormData()
    for (let file of this.images) formdata.append("file", file)

    switch (this.pageType) {
      case 'category':
        this.isTriggered = true
        this.CategoryService.bulkMediaUpload(formdata).subscribe((res: any) => {
          this.getResults(res?.errorCode, res?.message)
        })
        break
      case 'brand':
        this.isTriggered = true
        this.BrandService.bulkImageUpload(formdata).subscribe((res: any) => {
          this.getResults(res?.errorCode, res?.message)
        })
        break
      case 'collection':
        break
      case 'product':
        this.ProductService.bulkMediaUpload(formdata).subscribe((res: any) => {
          this.getResults(res?.errorCode, res?.message)
        })
        break
      case 'product-thumbnails':
        this.ProductService.bulkThumbnailUpload(formdata).subscribe((res: any) => {
          this.getResults(res?.errorCode, res?.message)
        })
        break
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

  navigateBack() {
    window.history.back()
  }
}
