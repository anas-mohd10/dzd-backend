import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
})
export class CollectionListComponent implements OnInit {
  appRoute = appRoutes;
  base: any
  collectionForm: FormGroup;
  collections: any;
  //Page and limit for query
  page: any = 1;
  currpage: any = 1;
  limit: any = 8;

  //Total no. of data from backend
  totalcount: any;
  count: any = 0

  //Conditions
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;

  //Filters array
  filters: any = [];

  constructor(private collectionService: CollectionService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.collectionService.getCollectionPage(this.page, this.limit).subscribe((res: any) => {
      this.collections = res?.result
      this.count = this.collections.length
      this.cdr.markForCheck();
    });
    this.collectionService.getCollectionCount().subscribe((res: any) => {
      this.totalcount = res?.result
      this.cdr.markForCheck();
    })
  }

  initForm() {
    this.collectionForm = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  onReload() {
    window.location.reload()
  }

  searchCollection() {
    this.currpage = 1
    this.collectionService.searchCollection(this.collectionForm.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.collections = res?.result?.data
        this.count = this.collections.length
        this.cdr.markForCheck();
        this.isData = true
        this.totalcount = res?.result?.total
        this.setBoolValues(this.totalcount, this.collections.length)
      }
    })
  }

  fetchMore() {
    this.currpage += 1
    this.collectionService.searchCollection(this.collectionForm.value, this.currpage, this.limit).subscribe((res: any) => {
      this.collections = [...this.collections, ...res?.result.data]
      this.count = this.collections.length
      this.setBoolValues(this.totalcount, this.collections.length)
      this.cdr.markForCheck();
    })
    if (this.currpage > 1) {
      this.showLessBtn = true
    }
  }

  fetchLess() {
    this.currpage = 1
    this.collectionService.searchCollection(this.collectionForm.value, this.currpage, this.limit).subscribe((res: any) => {
      this.collections = res?.result?.data
      this.count = this.collections.length
      this.setBoolValues(this.totalcount, this.collections.length)
      this.cdr.markForCheck();
    })
  }

  setBoolValues(datalen: any, brandlen: any) {
    if (datalen == brandlen) {
      this.showBtn = false
      this.showLessBtn = true
    } else {
      this.showBtn = true
      this.showLessBtn = false
    }
    if (brandlen == 0) {
      this.isData = false
    } else {
      this.isData = true
    }
  }


}
