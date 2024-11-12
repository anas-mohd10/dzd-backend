import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { ReviewService } from 'src/app/includes/services/review.service';
import { FormControl } from '@angular/forms';
import { ProductService } from 'src/app/includes/services/product.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { HotToastService } from '@ngneat/hot-toast';
@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss'],
})
export class ReviewsListComponent implements OnInit {
  appRoute = appRoutes;
  reviews: any = [];
  page: number = 1;
  limit: number = 20;
  isLastPage: Boolean = false;
  totalResults: number = 0;
  totalPages: number = 1;

  keyword: FormControl = new FormControl('');
  isActive: FormControl = new FormControl('');
  fromDate: FormControl = new FormControl('');
  toDate: FormControl = new FormControl('');

  review: FormControl = new FormControl('');
  data: any = {};
  rating: FormControl = new FormControl('');

  productKeyword: FormControl = new FormControl('');
  productStatus: FormControl = new FormControl('');
  productLimit: FormControl = new FormControl(20);
  productPage: number = 1;
  products: Array<any> = [];
  isProductLastPage: boolean = false;
  totalProducts: string = '';
  productReviews: Array<any> = [];
  totalReviews: string = '';
  modalRef?: BsModalRef;
  productDetails: any = {};
  reviewKeyword: FormControl = new FormControl('');
  isReviewEnabled: FormControl = new FormControl(false);

  constructor(
    private ReviewService: ReviewService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ProductService: ProductService,
    private BsModalService: BsModalService,
    private AppSettingsService: AppSettingsService
  ) {}

  ngOnInit(): void {
    this.getReviews();
    this.getProducts();
    this.getSettings();
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.isReviewEnabled.setValue(res?.result?.isReviewEnabled);
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => {},
    });
  }

  updateReview(data: any) {
    this.ReviewService.updateReview({ refid: data }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.HotToastService.success(res?.message);
        this.getReviews();
        if (this.productDetails?._id) this.getProductReviews();
      } else {
        this.HotToastService.error(res?.message);
      }
    });
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  toggleReviewStatus(event: { toggleState: boolean; switchId: string }) {
    this.ReviewService.updateReview({
      reviewId: event.switchId,
      isActive: event.toggleState,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.getReviews();
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });
  }

  deleteReview(data: any) {
    this.ReviewService.deleteReview({ refid: data }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.HotToastService.success(res?.message);
        this.getReviews();
      }
    });
  }

  selectReview(data: any) {
    this.data = data;
    this.rating.setValue(Number(data?.rating));
    this.ChangeDetectorRef.markForCheck();
  }

  enableReviewSettings(event: { toggleState: string; switchId: string }) {
    this.isReviewEnabled.setValue(event.toggleState);
    this.AppSettingsService.updateSettings({
      isReviewEnabled: this.isReviewEnabled.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSettings();
          this.HotToastService.success(res?.message);
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });
  }

  getReviews() {
    this.ReviewService.searchReviews({
      page: this.page,
      limit: this.limit,
      keyword: this.keyword?.value,
      isActive: this.isActive?.value,
      fromDate: this.fromDate?.value,
      toDate: this.toDate?.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.reviews = res?.result?.data;
          this.totalResults = res?.result?.totalResults;
          this.isLastPage = res?.result?.isLastPage;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => {},
    });
  }

  onPageTriggered(event: { pageIndex: number; pageSize: number }) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getReviews();
  }

  clearFilters() {
    this.keyword.setValue('');
    this.isActive.setValue('');
    this.fromDate.setValue('');
    this.toDate.setValue('');
    this.getReviews();
    this.limit = 20;
    this.page = 1;
  }

  getProductsPreviousPage() {
    this.productPage -= 1;
    this.getProducts();
  }

  getProductsNextPage() {
    this.productPage += 1;
    this.getProducts();
  }

  open(template: TemplateRef<any>, productDetails: any) {
    this.productDetails = productDetails;
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    this.getProductReviews();
  }

  getProductReviews() {
    this.ReviewService.productReviews({
      product: this.productDetails?._id,
      keyword: this.reviewKeyword?.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.productReviews = res?.result?.reviews;
          this.totalReviews = res?.result?.totalReviews;
          for (let review of this.productReviews)
            review.created = new Date(review?.created).toDateString();
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });
  }

  close() {
    this.productDetails = {};
    this.modalRef?.hide();
    this.reviewKeyword.setValue('');
  }

  updateProductReview(refid: any) {
    this.ReviewService.updateReview({ refid: refid }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.HotToastService.success(res?.message);
        this.getProductReviews();
      }
    });
  }

  clearProductFilters() {
    this.productKeyword.setValue('');
    this.productStatus.setValue('');
    this.productLimit.setValue(20);
    this.productPage = 1;
    this.getProducts();
  }

  getProducts() {
    this.ProductService.searchProducts({
      name: this.productKeyword?.value,
      isActive: this.productStatus?.value,
      page: this.productPage,
      limit: this.productLimit?.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.products = res?.result?.data;
          this.totalProducts = res?.result?.totalResults;
          this.isProductLastPage = res?.result?.isLastPage;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });
  }
}
