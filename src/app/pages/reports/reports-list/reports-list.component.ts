import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { reportsEndpoints } from 'src/app/config/endpoints';
import { appRoutes } from 'src/app/config/routes';
import { ProductService } from 'src/app/includes/services/product.service';
import { ReportsService } from 'src/app/includes/services/reports.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  appRoute = appRoutes;
  salesRef: BsModalRef
  exportUrl: string = environment.apiUrl
  dateRange: string = '15';
  base: string = environment.base
  productsModalRef?: BsModalRef;
  productsKeyword: FormControl = new FormControl('');
  products: Array<any> = [];
  productIds: Array<any> = [];

  reportItems: Array<any> = [
    { title: 'Product', description: 'Get the product report', type: 'product' },
    { title: 'Order', description: 'Get the order report', type: 'order' },
    { title: 'Order Detailed', description: 'Get the detailed order report', type: 'order-detailed' },
    { title: 'Customer', description: 'Get the customer report', type: 'customer' },
    { title: 'Customer Order', description: 'Get the customer order report', type: 'customer-order' },
    { title: 'Product Order', description: 'Get the product order report', type: 'product-order' },
    { title: 'Sales', description: 'Get the sales report', type: 'sales' },
    { title: 'Low Stock', description: 'Get the low stock report', type: 'lowstock' },
    { title: 'Abandoned Order', description: 'Get the abandoned order report', type: 'abandonedorder' },
    { title: 'Enquiry', description: 'Get the enquiry report', type: 'enquiry' },
    { title: 'No Movement', description: 'Get the no movement report', type: 'nomovement' },
    { title: 'Product Wise Order', description: 'Get the product wise order report', type: 'productwiseorder' },
    { title: 'All Customers', description: 'Get the all customers report', type: 'allcustomers' },
  ]

  dateRanges: Array<any> = [
    { title: '15 Days', description: 'Get the sales report for last 15 days', dateRange: '15' },
    { title: '1 Months', description: 'Get the sales report for last 30 days', dateRange: '1' },
    { title: '3 Months', description: 'Get the sales report for last 3 months', dateRange: '3' },
    { title: '6 Months', description: 'Get the sales report for last 6 months', dateRange: '6' },
    { title: '12 Months', description: 'Get the sales report for last 12 months', dateRange: '12' },
  ]

  constructor(
    private ReportsService: ReportsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Router: Router,
    private ProductService: ProductService,
    private BsModalService: BsModalService,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
  }

  //Open sales modal
  openSales(template: TemplateRef<any>) {
    this.salesRef = this.BsModalService.show(template)
  }

  closeSales() {
    this.salesRef?.hide()
  }
  //Open sales modal

  exportReport(type: string) {
    switch (type) {
      case 'product':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.productReport
        break
      case 'order':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.orderReport
        break
      case 'order-detailed':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.detailedOrderReport
        break
      case 'customer':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.customerReport
        break
      case 'customer-order':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.customerOrderReport
        break
      case 'product-order':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.productOrderReport
        break
    }
  }

  toggleSalesReport(dateRange: string) {
    this.dateRange = dateRange
  }

  salesReport() {
    this.ReportsService.salesReport(this.dateRange).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.closeSales()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  generateReport(type: string) {
    switch (type) {
      case 'lowstock':
        this.ReportsService.lowStockReport().subscribe({
          next: (res: any) => {
            this.onReponse(res)
            this.ChangeDetectorRef.markForCheck()
          }, error: (err: any) => {
            this.HotToastService.error(err?.error?.message)
          }
        })
        break
      case 'product':
        this.ReportsService.productReport().subscribe({
          next: (res: any) => {
            this.onReponse(res)
            this.ChangeDetectorRef.markForCheck()
          }, error: (err: any) => {
            this.HotToastService.error(err?.error?.message)
          }
        })
        break
      case 'unfullfilledStock':
        this.ReportsService.unfullfilledStockReport().subscribe({
          next: (res: any) => {
            this.onReponse(res)
            this.ChangeDetectorRef.markForCheck()
          }, error: (err: any) => {
            this.HotToastService.error(err?.error?.message)
          }
        })
        break
      case 'abandonedorder':
        this.ReportsService.abandonedOrderReport().subscribe({
          next: (res: any) => {
            this.onReponse(res)
            this.ChangeDetectorRef.markForCheck()
          }, error: (err: any) => {
            this.HotToastService.error(err?.error?.message)
          }
        })
        break
      case 'customerOrder':
        this.ReportsService.customerOrderReport().subscribe({
          next: (res: any) => {
            this.onReponse(res)
            this.ChangeDetectorRef.markForCheck()
          }, error: (err: any) => {
            this.HotToastService.error(err?.error?.message)
          }
        })
        break
      case 'enquiry':
        this.ReportsService.enquiryReport().subscribe({
          next: (res: any) => {
            this.onReponse(res)
            this.ChangeDetectorRef.markForCheck()
          }, error: (err: any) => {
            this.HotToastService.error(err?.error?.message)
          }
        })
        break
      case 'nomovement':
        this.ReportsService.orderMovementReport().subscribe({
          next: (res: any) => {
            this.onReponse(res)
            this.ChangeDetectorRef.markForCheck()
          }, error: (err: any) => {
            this.HotToastService.error(err?.error?.message)
          }
        })
        break
      case 'productwiseorder':
        let ids = this.productIds.map((productId: any) => productId._id)
        this.ReportsService.productWiseDetailedOrderReport({ products: ids }).subscribe({
          next: (res: any) => {
            this.onReponse(res)
            this.closeProductsModal()
            this.ChangeDetectorRef.markForCheck()
          }, error: (err: any) => {
            this.HotToastService.error(err?.error?.message)
          }
        })
        break
      case 'allcustomers':
        this.ReportsService.customerReport().subscribe({
          next: (res: any) => {
            this.onReponse(res)
            this.closeProductsModal()
            this.ChangeDetectorRef.markForCheck()
          }, error: (err: any) => {
            this.HotToastService.error(err?.error?.message)
          }
        })
        break
    }
  }

  oepnProductsModal(template: TemplateRef<any>) {
    this.productsModalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true })
  }

  searchProducts() {
    setTimeout(() => {
      this.ProductService.searchProducts({ name: this.productsKeyword.value }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.products = res?.result?.data
            this.ChangeDetectorRef.markForCheck()
          } else { }
        }, error: (err: any) => { }
      })
    }, 800)
  }

  generateProductWiseOrderReport() {
    this.generateReport('productwiseorder')
  }

  toggleProducts(product: any) {
    let index = this.productIds.findIndex((productId: any) => productId._id == product._id)
    if (index == -1) {
      this.productIds.push(product)
    } else {
      this.productIds.splice(index, 1)
    }
  }

  closeProductsModal() {
    this.productsModalRef?.hide()
    this.productIds = []
    this.products = []
    this.productsKeyword.setValue('')
  }

  onReponse(res: any) {
    if (res.errorCode == 0) {
      this.HotToastService.success(res?.message)
    } else {
      this.HotToastService.error(res.message)
    }
  }
}
