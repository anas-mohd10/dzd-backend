import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bulk-file-upload',
  templateUrl: './bulk-file-upload.component.html',
  styleUrls: ['./bulk-file-upload.component.scss']
})
export class BulkFileUploadComponent implements OnInit {
  pageTitle: any
  pageType: any

  constructor(
    private ActivatedRoute: ActivatedRoute
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

  navigateBack() {
    window.history.back()
  }
}
