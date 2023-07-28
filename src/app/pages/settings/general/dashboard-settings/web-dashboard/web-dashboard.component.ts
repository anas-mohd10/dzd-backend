import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-web-dashboard',
  templateUrl: './web-dashboard.component.html',
  styleUrls: ['./web-dashboard.component.scss']
})
export class WebDashboardComponent implements OnInit {
  dashboard: Array<any> = []
  routes = appRoutes
  settings: any = {}
  base: string = environment.base
  collectionForm!: FormGroup
  collectionFileString: string = ''
  collectionFileName: string = ''
  product: FormControl = new FormControl('')
  searchProducts: Array<any> = []
  products: Array<any> = []
  productDetails: Array<any> = []
  productsData: Array<any> = []

  constructor(
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private Router: Router,
    private DomSanitizer: DomSanitizer,
    private ProductService: ProductService
  ) { }

  @ViewChild('previewFrame', { static: true }) myIframe: ElementRef;
  iframeSrc: SafeResourceUrl = this.DomSanitizer.bypassSecurityTrustResourceUrl('https://sajidhaweb.s414.previewbay.com/');

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
      }
    })

    this.DashboardService.getWebDashboard().subscribe((res: any) => {
      if (res?.ErrorCode == 0) {
        this.dashboard = res?.Data?.home_details
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.collectionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      subname: new FormControl(''),
      type: new FormControl('slider'),
      isFeatured: new FormControl(true),
    })
  }

  get collectionFormControl() {
    return this.collectionForm.controls;
  }

  drop(event: CdkDragDrop<string[]>) {
    let dashboard = [...this.dashboard]
    moveItemInArray(dashboard, event.previousIndex, event.currentIndex);
    this.dashboard = [...dashboard]
  }

  navigateBack() {
    window.history.back()
  }

  publish() {
    this.DashboardService.publishDashboard({ dashboard: JSON.stringify(this.dashboard) }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        window.open(this.settings.domain, '_blank')

      }
    })
  }

  preview() {
    this.DashboardService.previewDashboard({ dashboard: JSON.stringify(this.dashboard) }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        const iframeElement: HTMLIFrameElement = this.myIframe.nativeElement;
        iframeElement.src = iframeElement.src;
      }
    })
  }

  discard() {
    this.DashboardService.getWebDashboard().subscribe((res: any) => {
      if (res?.ErrorCode == 0) {
        this.dashboard = res?.Data?.home_details
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  //Collection management
  getProducts() {
    if (this.product.value) {
      this.ProductService.findProducts({ name: this.product.value }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.searchProducts = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      })
    } else { this.searchProducts = [] }
  }

  selectProduct(product: any) {
    if (!this.products.includes(product?._id)) {
      this.productDetails.push(product)
      this.products.push(product?._id)
    } else {
      this.productDetails = this.productDetails.filter((item: any) => item._id != product?._id)
      this.products = this.products.filter((item: any) => item != product?._id)
    }
  }

  dropProduct(event: CdkDragDrop<string[]>) {
    let products = [...this.productDetails]
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.productDetails = [...products]
  }

  addCollection() {
    if (!this.collectionForm.valid) {
      return
    }

    let selectedProducts = []
    for (let product of this.productDetails) selectedProducts.push(product?._id)

    let payload = {
      ...this.collectionForm.value,
      filestring: this.collectionFileString,
      filename: this.collectionFileName,
      products: this.products
    }

    console.log(payload);
  }
  //Collection management
}
