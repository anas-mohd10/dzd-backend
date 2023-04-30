import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';


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

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private BrandService: BrandService,
    private ToastrService: ToastrService,
    private CategoryService: CategoryService
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
    }
  }

  fileUpload(event: any){
    this.filedata = event.files[0]
    this.filename = this.filedata.name
    this.filesize = this.filedata.size/1024

    const reader = new FileReader();
    reader.readAsDataURL(this.filedata);
    reader.onload = () => {
        this.filestring = reader.result
    };

    if(this.filedata) this.isUploaded = true
  }

  removeFileUpload(){
    this.filedata = null
    this.isUploaded = false
  }

  navigateBack() {
    window.history.back()
  }

  bulkUpload(){
    let formdata = new FormData()
    formdata.append("file", this.filedata)
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
        break
      case 'product':
        break
    }
  }

  getResults(errorCode: any, message: any){
    if(errorCode == 0){ 
      this.isTriggered = false
      window.history.back()
      this.ToastrService.success(message)
    }else{
      this.isTriggered = false
      this.ToastrService.error(message)
    }
  }
}
