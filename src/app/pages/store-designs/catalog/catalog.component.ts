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
  catalogTitle: FormControl = new FormControl("");

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
    this.catalogForm.get("isCopy")?.setValue(false)
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
          if (res?.result?.seoTitle || res?.result?.seoDescription || res?.result?.seoKeyword) {
            this.metaForm.patchValue(res?.result)
          } else {
            this.metaForm.reset()
          }
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  updateCatalog() {
    this.catalogForm.get("title")?.setValue(this.catalogTitle?.value)
    this.CatalogService.updateCatalog(this.catalogForm.value, this.catalogPageDetails?.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.closeCreate()
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.getCatalogs()
          if (this.catalogTitle?.value) this.catalogTitle.reset()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  updateCatalogSeo() {
    this.CatalogService.updateCatalog(this.metaForm.value, this.catalogPageDetails?.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
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
      seoTitle: new FormControl(""),
      seoDescription: new FormControl(""),
      seoKeywords: new FormControl(""),
    })

    this.catalogForm = new FormGroup({
      title: new FormControl("", Validators.required),
      description: new FormControl(""),
      isCopy: new FormControl(false),
      catalogReference: new FormControl(""),
    })
  }

}
