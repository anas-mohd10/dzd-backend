import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { csvEndpoints } from 'src/app/config/endpoints';
import { appRoutes } from 'src/app/config/routes';
import { BlogService } from 'src/app/includes/services/blog.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CsvService } from 'src/app/includes/services/csv.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-uploads-list',
  templateUrl: './uploads-list.component.html',
  styleUrls: ['./uploads-list.component.scss'],
})
export class UploadsListComponent implements OnInit {
  appRoute = appRoutes;
  fileImports: Array<any> = [];
  status: FormControl = new FormControl('');
  isLastPage: boolean = false;
  totalPages: number = 0;
  totalResults: number = 0;
  page: number = 1;
  limit: number = 20;
  modalRef?: BsModalRef;
  types: Array<{ title: string; type: string }> = [
    { title: 'Category', type: 'category' },
    { title: 'Brand', type: 'brand' },
    { title: 'User', type: 'user' },
    { title: 'Collection', type: 'collection' },
    // { title: 'Blogs', type: 'blog' },
    // { title: 'Orders', type: 'order' },
    // { title: 'Subscribers', type: 'subscriber' },
  ];
  fileData: any;
  fileName: string;
  fileSize: number;
  file: FormControl = new FormControl('');
  importType: FormControl = new FormControl('', Validators.required);
  isFile: boolean = false;
  statusFilters: Array<{ title: string; status: string }> = [
    { title: 'All', status: '' },
    { title: 'Progress', status: 'progress' },
    { title: 'Completed', status: 'completed' },
    { title: 'Failed', status: 'failed' },
    { title: 'Awaiting', status: 'awaiting' },
  ];
  isSubmitting: boolean = false;
  createdAt: string;
  createdBy: FormControl = new FormControl('');
  baseUrl = `${environment.apiUrl}/${csvEndpoints.downloadImportLog}/`;

  // Map of sample CSV files for each import type
  sampleCsvFiles: { [key: string]: string } = {
    'category': 'assets/files/categories_upload.csv',
  'brand': 'assets/files/brands_upload.csv',
  'user': 'assets/files/users_upload.csv',
  'collection': 'assets/files/collection_upload.csv',
  'product': 'assets/files/storeDadaSampleProducts.csv',
  'blog': 'assets/files/blogs_upload.csv',
  'order': 'assets/files/orders_upload.csv',
  'subscriber': 'assets/files/subscribers_upload.csv',
  };

  constructor(
    private CsvService: CsvService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private CategoryService: CategoryService,
    private BrandService: BrandService,
    private HotToastService: HotToastService,
    private CollectionService: CollectionService,
    private ProductService: ProductService,
    private CustomersService: CustomersService,
    private BlogService: BlogService,
    private OrdersService: OrdersService
  ) { }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getMinutes(milliSeconds: number) {
    return Math.floor(milliSeconds / 60000);
  }

  close() {
    this.modalRef?.hide();
    this.importType.setValue('');
    this.closeFileUpload();
    this.isSubmitting = false;
  }

  ngOnInit(): void {
    this.fetchFileImports();
  }

  handleFileUpload(event: any) {
    let extensionCheck: boolean = event.files[0]?.name
      .toLowerCase()
      .endsWith('.csv');
    if (extensionCheck) {
      this.fileData = event.files[0];
      this.fileName = this.fileData.name;
      this.fileSize = this.fileData.size / 1024 / 1024;
      this.fileSize > 100
        ? this.HotToastService.error('File size should be less than 100MB')
        : (this.isFile = true);
    } else {
      this.HotToastService.error('Please upload a CSV file');
    }
  }

  closeFileUpload() {
    this.fileData = null;
    this.fileName = '';
    this.fileSize = 0;
    this.file.reset();
  }

  upload() {
    let formdata = new FormData();
    formdata.append('file', this.fileData);

    if (this.isFile) {
      this.isSubmitting = true;
      switch (this.importType.value) {
        case 'category':
          this.CategoryService.bulkFileUpload(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {
                this.onSuccess(res?.message);
              } else {
                this.HotToastService.error(res?.message);
              }
            },
            error: (err: any) => {
              this.HotToastService.error(err?.error?.message);
            },
          });
          break;
        // case 'order':
        //   this.OrdersService.bulkFileUpload(formdata).subscribe({
        //     next: (res: any) => {
        //       if (res?.errorCode == 0) {
        //         this.onSuccess(res?.message);
        //       } else {
        //         this.HotToastService.error(res?.message);
        //       }
        //     },
        //     error: (err: any) => {
        //       this.HotToastService.error(err?.error?.message);
        //     },
        //   });
        //   break;
        case 'brand':
          this.BrandService.bulkFileUpload(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {
                this.onSuccess(res?.message);
              } else {
                this.HotToastService.error(res?.message);
              }
            },
            error: (err: any) => {
              this.HotToastService.error(err?.error?.message);
            },
          });
          break;
        case 'collection':
          this.CollectionService.bulkFileUpload(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {
                this.onSuccess(res?.message);
              } else {
                this.HotToastService.error(res?.message);
              }
            },
            error: (err: any) => {
              this.HotToastService.error(err?.error?.message);
            },
          });
          break;
        case 'user':
          this.CustomersService.bulkFileUpload(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {
                this.onSuccess(res?.message);
              } else {
                this.HotToastService.error(res?.message);
              }
            },
            error: (err: any) => {
              this.HotToastService.error(err?.error?.message);
              this.isSubmitting = false;
            },
          });
          break;
        case 'subscriber':
          this.CustomersService.bulkSubscribersFileUpload(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {
                this.onSuccess(res?.message);
              } else {
                this.HotToastService.error(res?.message);
              }
            },
            error: (err: any) => {
              this.HotToastService.error(err?.error?.message);
              this.isSubmitting = false;
            },
          });
          break;
        case 'product':
          this.ProductService.importProducts(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {
                this.onSuccess(res?.message);
              } else {
                this.HotToastService.error(res?.message);
              }
            },
            error: (err: any) => {
              this.HotToastService.error(err?.error?.message);
              this.isSubmitting = false;
            },
          });
          break;
        case 'blog':
          this.BlogService.importBlogs(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {
                this.onSuccess(res?.message);
              } else {
                this.HotToastService.error(res?.message);
              }
            },
            error: (err: any) => {
              this.HotToastService.error(err?.error?.message);
              this.isSubmitting = false;
            },
          });
          break;
        case 'update-product':
          this.ProductService.bulkUpdateProducts(formdata).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {
                this.onSuccess(res?.message);
              } else {
                this.HotToastService.error(res?.message);
              }
            },
            error: (err: any) => {
              this.HotToastService.error(err?.error?.message);
              this.isSubmitting = false;
            },
          });
          break;
        default:
          this.HotToastService.error('Please select an import type');
          break;
      }
    } else {
      this.HotToastService.error('Please upload a CSV file');
    }
  }

  onSuccess(message: string) {
    this.HotToastService.success(message);
    this.close();
    this.fetchFileImports();
  }

  onPageTriggered(event: { pageIndex: number; pageSize: number }) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.fetchFileImports();
  }

  clearFilters() {
    this.createdAt = '';
    this.page = 1;
    this.limit = 20;
    this.fetchFileImports();
    this.status?.setValue('');
    this.ChangeDetectorRef.markForCheck();
  }

  fetchFileImports() {
    this.CsvService.getFileImports({
      page: this.page,
      limit: this.limit,
      status: this.status.value,
      date: this.createdAt,
      createdBy: this.createdBy.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          let data = res.result.data || res.result;
          // Filter by createdBy (case-insensitive, partial match)
          const search = this.createdBy.value?.toLowerCase();
          if (search) {
            data = data.filter((item: any) => item.createdBy?.toLowerCase().includes(search));
          }
          // Sort by createdBy (A-Z)
          this.fileImports = data.sort((a: any, b: any) => a.createdBy.localeCompare(b.createdBy));
          this.isLastPage = res?.result?.isLastPage;
          this.totalPages = res?.result?.totalPages;
          this.totalResults = res?.result?.totalResults;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  downloadImportLog(fileId: string) {
    this.CsvService.downloadImportLog(fileId).subscribe({
      next: (res: any) => {
        this.HotToastService.success(res?.message || 'Downloaded successfully');
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    });
  }

  /**
   * Downloads the sample CSV file for the selected import type
   */
  downloadSampleCsv(): void {
    const importType = this.importType.value;

    if (!importType) {
      this.HotToastService.error('Please select an import type first');
      return;
    }

    const filePath = this.sampleCsvFiles[importType];

    if (!filePath) {
      this.HotToastService.error('Sample CSV not available for this import type');
      return;
    }

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = filePath;
    link.download = `sample_${importType}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.HotToastService.success(`Sample ${importType} CSV downloaded successfully`);
  }
}
