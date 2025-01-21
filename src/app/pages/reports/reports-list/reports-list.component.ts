import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
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
  styleUrls: ['./reports-list.component.scss'],
})
export class ReportsListComponent implements OnInit {
  @ViewChild('productsTemplate') productsTemplate!: TemplateRef<any>;

  appRoute = appRoutes;
  modalRef: BsModalRef;
  exportUrl: string = environment.apiUrl;
  dateRange: string = '';
  base: string = environment.base;
  productsModalRef?: BsModalRef;
  productsKeyword: FormControl = new FormControl('');
  products: Array<any> = [];
  productIds: Array<any> = [];
  isCustomRange: boolean = false;
  startDate: string = '';
  endDate: string = '';
  currentReportType: string = '';


  saleReportItems: Array<any> =
    [
      {
        title: 'Sale Over Time Report',
        description: 'The Sales over time report shows the number of orders and the total sales that you made over time. You can select custom date range and filters as well.',
        type: 'sales',
      },
      {
        title: 'Order Over Time Report',
        description: 'The Order over time report shows the number of orders and the total Order that you made over time. You can select custom date range and filters as well.',
        type: 'order-over-time-report',
      },
      {
        title: 'Detailed Orders report',
        description: 'Export your order sales report, Each row contains order id and associated details. To see details of product with each order, Please choose the productwise detailed order report.',
        type: 'detailed-order-over-time-report',
      },
      {
        title: 'Product Wise Detailed Order Report',
        description: 'This report shows total orders with order id and each product in seperate row with each respect to date.',
        type: 'product-wise-detailed-order-report',
      },

    ];


  reportItems: Array<any> = [
    {
      title: 'Customer Order Report',
      description: 'Get the list of customers with the orders details',
      type: 'customerOrder',
    },
    {
      title: 'Customers Report',
      description: 'Get the list of current users in the platform',
      type: 'allcustomers',
    },
    {
      title: 'Enquiry Report',
      description: 'Get the list of enquiries in the platform',
      type: 'enquiry-report',
    },
    {
      title: 'Abandoned Order Report',
      description: 'Get orders with failed or pending status till date',
      type: 'abandonedorder-report',
    },
    {
      title: 'Products Sales Report',
      description: 'Get the list of products with details',
      type: 'productwisereport',
    },
    {
      title: 'Products Report',
      description: 'Get the list of products with details',
      type: 'productreport',
    },

  ];

  dateRanges: Array<any> = [
    {
      title: '15 Days',
      description: 'Get the report for last 15 days',
      dateRange: '15',
    },
    {
      title: '1 Month',
      description: 'Get the report for last 30 days',
      dateRange: '1',
    },
    {
      title: '3 Months',
      description: 'Get the report for last 3 months',
      dateRange: '3',
    },
    {
      title: '6 Months',
      description: 'Get the report for last 6 months',
      dateRange: '6',
    },
    {
      title: '12 Months',
      description: 'Get the report for last 12 months',
      dateRange: '12',
    },
  ];

  constructor(
    private reportsService: ReportsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private productService: ProductService,
    private modalService: BsModalService,
    private toastService: HotToastService
  ) { }

  ngOnInit(): void { }


  generateOtherReports(type: string) {
    switch (type) {
      case 'lowstock':
        this.reportsService.lowStockReport().subscribe({
          next: (res: any) => {
            this.onReponse(res);
            this.changeDetectorRef.markForCheck();
          },
          error: (err: any) => {
            this.toastService.error(err?.error?.message);
          },
        });
        break;
      case 'userAlerts':
        this.reportsService.downloadSubscribers().subscribe({
          next: (res: any) => {
            this.onReponse(res);
            this.changeDetectorRef.markForCheck();
          },
          error: (err: any) => {
            this.toastService.error(err?.error?.message);
          },
        });
        break;
      
      case 'basic-product':
        this.reportsService.basicProductReport().subscribe({
          next: (res: any) => {
            this.onReponse(res);
            this.changeDetectorRef.markForCheck();
          },
          error: (err: any) => {
            this.toastService.error(err?.error?.message);
          },
        });
        break;
      case 'unfullfilledStock':
        this.reportsService.unfullfilledStockReport().subscribe({
          next: (res: any) => {
            this.onReponse(res);
            this.changeDetectorRef.markForCheck();
          },
          error: (err: any) => {
            this.toastService.error(err?.error?.message);
          },
        });
        break;
      case 'nomovement':
        this.reportsService.orderMovementReport().subscribe({
          next: (res: any) => {
            this.onReponse(res);
            this.changeDetectorRef.markForCheck();
          },
          error: (err: any) => {
            this.toastService.error(err?.error?.message);
          },
        });
        break;
      case 'productwiseorder':
        let ids = this.productIds.map((productId: any) => productId?._id);
        this.reportsService.productWiseDetailedOrderReport({
          products: ids,
        }).subscribe({
          next: (res: any) => {
            this.onReponse(res);
            this.closeProductsModal();
            this.changeDetectorRef.markForCheck();
          },
          error: (err: any) => {
            this.toastService.error(err?.error?.message);
          },
        });
        break;

      // case 'product-order':
      //   this.reportsService.productOrderReport().subscribe({
      //   next: (res: any) => {
      //     this.onReponse(res);
      //     this.changeDetectorRef.markForCheck();
      //   },
      //   error: (err: any) => {
      //     this.toastService.error(err?.error?.message);
      //   },
      // });
      // break;

    }
  }

  onReponse(res: any) {
    if (res.errorCode == 0) {
      this.toastService.success(res?.message);
    } else {
      this.toastService.error(res.message);
    }
  }



  openDateRangeModal(reportType: string, template: TemplateRef<any>) {
    this.currentReportType = reportType;
    if (reportType === 'productwiseorder') {
      this.openProductsModal();
      return;
    }
    this.modalRef = this.modalService.show(template);
  }

  closeDateRangeModal() {
    this.modalRef?.hide();
    this.resetDateRange();
  }

  resetDateRange() {
    this.dateRange = '';
    this.startDate = '';
    this.endDate = '';
    this.isCustomRange = false;
  }

  toggleDateRange(dateRange: string) {
    this.dateRange = dateRange;
    this.isCustomRange = dateRange === 'custom';

    if (!this.isCustomRange) {
      // Clear start and end dates only if switching to non-custom range
      this.startDate = '';
      this.endDate = '';
    }
  }


  validateCustomDateRange(): any {
    if (!this.dateRange) {
      this.toastService.error('Please select a date range');
      return false;
    }
    if (this.dateRange == 'custom') {
      this.startDate = new Date(this.startDate).toISOString().split('T')[0]
      this.endDate = new Date(this.endDate).toISOString().split('T')[0]

      if (this.startDate == '' || this.endDate == '') {
        this.toastService.error('Please select a valid date range')
        this.startDate = ''
        this.endDate = ''
        return
      }

      if (this.startDate > this.endDate) {
        this.toastService.error('Start date cannot be greater than end date')
        this.startDate = ''
        this.endDate = ''
        return
      }
    }


    return true;
  }


  generateDateRangeReport() {
    if (!this.validateCustomDateRange()) {
      return;
    }
    const params = {
      dateRange: this.isCustomRange ? 'custom' : this.dateRange,
      startDate: this.isCustomRange ? this.startDate : '',
      endDate: this.isCustomRange ? this.endDate : ''
    };
    // Close modal first
    this.closeDateRangeModal();

    switch (this.currentReportType) {
      case 'sales':
        this.generateSalesReport(params);
        break;
      case 'order-over-time-report':
        this.generateOrdersReport(params);
        break;
      case 'detailed-order-over-time-report':
        this.generateDetailedOrderReport(params);
        break;
      case 'product-wise-detailed-order-report':
        this.generateProductWiseDetailedOrderReport(params);
        break;
      case 'order-report':
        this.generateOrdersReport(params);
        break;
      case 'allcustomers':
        this.generateAllCustomerReport(params);
        break;
      case 'productwisereport':
        this.generateProductSalesReport(params);
        break;
      case 'productreport':
        this.generateProductReport(params);
        break;
      case 'enquiry-report':
        this.generateEnquiryReport(params);
        break;
      case 'abandonedorder-report':
        this.generateAbandonedOrderReport(params);
        break;
      case 'customerOrder':
        this.generateCustomerOrderReport(params);
        break;
      case 'orders-time':
        this.generateOrdersTimeReport(params);
        break;
      default:
        this.generateReport(this.currentReportType, params);
        break;
    }
  }


  handleReportResponse(res: any) {
    if (res.errorCode === 0) {
      // Only show success message after API success
      this.toastService.success(res?.message);
    } else {
      this.toastService.error(res.message);
    }
    // Reset date range after response
    this.resetDateRange();
  }

  generateSalesReport(params: any) {
    this.reportsService.salesReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }



  generateAllCustomerReport(params: any) {
    this.reportsService.customerReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  generateProductSalesReport(params: any) {
    this.reportsService.productWiseSalesReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  generateProductReport(params: any) {
    this.reportsService.productReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  generateOrderOverTimeReport(params: any) {
    this.reportsService.orderOverTimeReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  generateDetailedOrderReport(params: any) {
    this.reportsService.detailedOrderReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  generateProductWiseDetailedOrderReport(params: any) {
    this.reportsService.productOrderReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }
  




  generateOrdersReport(params: any) {
    this.reportsService.orderOverTimeReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  generateAbandonedOrderReport(params: any) {
    this.reportsService.abandonedOrderReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  generateEnquiryReport(params: any) {
    this.reportsService.enquiryReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  generateCustomerOrderReport(params: any) {
    this.reportsService.customerOrderReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  generateOrdersTimeReport(params: any) {
    // Include both date range and custom dates
    this.reportsService.detailedOrdersOverTimeReport(
      params.dateRange,
      params.startDate,
      params.endDate
    ).subscribe({
      next: (res: any) => {
        this.handleReportResponse(res);
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }


  generateReport(type: string, params: any) {
    const reportMethods: { [key: string]: () => any } = {
      allcustomers: () => this.reportsService.customerReport(params),
    };

    const reportMethod = reportMethods[type];
    if (reportMethod) {
      reportMethod().subscribe({
        next: (res: any) => {
          this.handleReportResponse(res);
        },
        error: (err: any) => {
          this.handleError(err);
        },
      });
    }
  }


  openProductsModal() {
    this.productsModalRef = this.modalService.show(this.productsTemplate, {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  closeProductsModal() {
    this.productsModalRef?.hide();
    this.productIds = [];
    this.products = [];
    this.productsKeyword.setValue('');
  }

  searchProducts() {
    setTimeout(() => {
      this.productService.searchProducts({
        name: this.productsKeyword.value,
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.products = res?.result?.data;
            this.changeDetectorRef.markForCheck();
          }
        },
        error: (err: any) => {
          this.toastService.error(err?.error?.message);
        },
      });
    }, 800);
  }

  toggleProducts(product: any) {
    const index = this.productIds.findIndex(
      (productId: any) => productId?._id == product?._id
    );
    if (index == -1) {
      this.productIds.push(product);
    } else {
      this.productIds.splice(index, 1);
    }
  }

  generateProductWiseOrderReport() {
    const productIds = this.productIds.map((product: any) => product?._id);

    if (!productIds.length) {
      this.toastService.error('Please select at least one product');
      return;
    }

    this.reportsService.productWiseDetailedOrderReport({
      products: productIds,
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode === 0) {
          this.toastService.success(res?.message);
          this.closeProductsModal();
          this.changeDetectorRef.markForCheck();
        } else {
          this.toastService.error(res.message);
        }
      },
      error: (err: any) => {
        this.toastService.error(err?.error?.message);
      },
    });
  }

  exportReport(type: string) {
    const exportEndpoints: { [key: string]: string } = {
      'product': reportsEndpoints.productReport,
      'order': reportsEndpoints.orderReport,
      'order-detailed': reportsEndpoints.detailedOrderReport,
      'customer': reportsEndpoints.customerReport,
      'customer-order': reportsEndpoints.customerOrderReport,
      'product-order': reportsEndpoints.productOrderReport
    };

    if (exportEndpoints[type]) {
      this.exportUrl = `/api/v1/w/admin/auth${exportEndpoints[type]}`;

      if (this.dateRange === 'custom' && this.startDate && this.endDate) {
        this.exportUrl += `?startDate=${this.startDate}&endDate=${this.endDate}`;
      } else if (this.dateRange !== 'custom') {
        this.exportUrl += `?dateRange=${this.dateRange}`;
      }
    }
  }

  getReportTitle(type: string): string {
    const report = this.reportItems.find(item => item.type === type);
    return report ? report.title : 'Report';
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  handleError(error: any) {
    const errorMessage = error?.error?.message || 'An error occurred';
    this.toastService.error(errorMessage);
  }
}