import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bulk-media-upload',
  templateUrl: './bulk-media-upload.component.html',
  styleUrls: ['./bulk-media-upload.component.scss']
})
export class BulkMediaUploadComponent implements OnInit {
  pageTitle: any
  pageType: any

  constructor(
    private ActivatedRoute: ActivatedRoute
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
    }
  }

  navigateBack() {
    window.history.back()
  }
}
