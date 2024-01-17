import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CatalogService } from 'src/app/includes/services/catalog.service';
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  catalogPage: FormControl = new FormControl("");
  catalogPages: Array<any> = [];
  catalogPageDetails: any = {};
  metaForm: FormGroup;
  catalogForm: FormGroup;
  createRef?: BsModalRef
  isCopy: FormControl = new FormControl(false);

  constructor(
    private BsModalService: BsModalService,
    private CatalogService: CatalogService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  openCreate(template: TemplateRef<any>): void {
    this.createRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  closeCreate(): void {
    this.createRef?.hide()
    this.catalogForm.reset()
  }

  createCatalog() {
    this.CatalogService.createCatalog(this.catalogForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.closeCreate()
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.getCatalogs()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  getCatalogs() {
    this.CatalogService.getCatalogs().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.catalogPages = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }, complete: () => {
        if (this.catalogPages.length > 0) {
          this.catalogPage.setValue(this.catalogPages[0].slug)
          this.getCatalogDetails()
        }
      }
    })
  }

  getCatalogDetails() {
    this.CatalogService.getCatalogDetails(this.catalogPage.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.catalogPageDetails = res?.result
          this.catalogForm.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  ngOnInit(): void {
    this.getCatalogs()
    this.metaForm = new FormGroup({
      metaTitle: new FormControl(""),
      metaDescription: new FormControl(""),
      metaKeywords: new FormControl(""),
    })

    this.catalogForm = new FormGroup({
      title: new FormControl("", Validators.required),
      description: new FormControl(""),
      isCopy: new FormControl(false),
      catalogReference: new FormControl(""),
    })
  }

}
