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
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};

  appRoute = appRoutes;
  collectionData: any
  displayTable: boolean;
  base: any
  collectionForm: FormGroup;
  count: any;
  pages: any = [];
  page: any = 1;
  limit: any = 4;
  collections: any;
  isData: boolean= true;


  constructor(private collectionService: CollectionService,
    private cdr:ChangeDetectorRef,
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.getCollection();
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
  }

  getCollection() {
    this.collectionService.getCollection().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.collectionData = res?.result
          this.cdr.markForCheck()
          break
      }
      this.displayTable = true;
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

  onChange() {
    this.collectionService.searchCollection(this.collectionForm.value, this.page, this.limit).subscribe((res: any) => {
      console.log(res);

      if (res?.errorCode == 0) {
        this.collections = res?.result?.data
        this.cdr.markForCheck();
        this.isData = true
        if (this.collections.length == 0) {
          this.isData = false
        }
        this.pages.length = 0
        this.count = Math.ceil(res?.result?.total / this.limit)
        for (let i = 1; i <= this.count; i++) {
          this.pages.push({
            key: i,
          })
        }
      }
    })
  }

}
