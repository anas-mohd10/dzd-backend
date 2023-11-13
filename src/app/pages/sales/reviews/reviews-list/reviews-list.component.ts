import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { ReviewService } from 'src/app/includes/services/review.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { ProductService } from 'src/app/includes/services/product.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit {
  appRoute = appRoutes
  reviews: any = []
  page: number = 1
  limit: FormControl = new FormControl(20)
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  fromDate: FormControl = new FormControl('')
  toDate: FormControl = new FormControl('')
  isLastPage: Boolean = false
  review: FormControl = new FormControl('')
  data: any = {}
  totalResults: string = ''
  rating: FormControl = new FormControl('')

  productKeyword: FormControl = new FormControl('')
  productStatus: FormControl = new FormControl('')
  productLimit: FormControl = new FormControl(20)
  productPage: number = 1
  products: Array<any> = []
  isProductLastPage: boolean = false
  totalProducts: string = ''
  productReviews: Array<any> = []
  totalReviews: string = ''
  modalRef?: BsModalRef
  productDetails: any = {}
  reviewKeyword: FormControl = new FormControl('')

  constructor(
    private ReviewService: ReviewService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ProductService: ProductService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getReviews()
    this.getProducts()
  }

  updateReview(data: any) {
    this.ReviewService.updateReview({ refid: data }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
        this.getReviews()
        if (this.productDetails?.prodid) this.getProductReviews()
      } else {
        this.ToastrService.error(res?.message)
      }
    })
  }

  deleteReview(data: any) {
    this.ReviewService.deleteReview({ refid: data }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
        this.getReviews()
      }
    })
  }

  selectReview(data: any) {
    this.data = data
    this.rating.setValue(Number(data?.rating))
    this.ChangeDetectorRef.markForCheck()
  }

  getReviews() {
    let payload = {
      page: this.page,
      limit: this.limit?.value,
      keyword: this.keyword?.value,
      isActive: this.isActive?.value,
      fromDate: this.fromDate?.value,
      toDate: this.toDate?.value
    }

    this.ReviewService.searchReviews(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.reviews = res?.result?.data
        this.totalResults = res?.result?.totalResults
        for (let data of this.reviews) {
          data.created = new Date(data?.created).toDateString()
          if (data.isActive) this.review.setValue(data?.refid)
        }
        this.isLastPage = res?.result?.isLastPage
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  getPreviousPage() {
    this.page -= 1
    this.getReviews()
  }

  getNextPage() {
    this.page += 1
    this.getReviews()
  }

  getProductsPreviousPage() {
    this.productPage -= 1
    this.getProducts()
  }

  getProductsNextPage() {
    this.productPage += 1
    this.getProducts()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.fromDate.setValue('')
    this.toDate.setValue('')
    this.getReviews()
    this.limit.setValue(20)
    this.page = 1
  }

  open(template: TemplateRef<any>, productDetails: any) {
    this.productDetails = productDetails
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
    this.getProductReviews()
  }

  getProductReviews() {
    this.ReviewService.productReviews({ product: this.productDetails?.prodid, keyword: this.reviewKeyword?.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.productReviews = res?.result?.reviews
          this.totalReviews = res?.result?.totalReviews
          for (let review of this.productReviews) review.created = new Date(review?.created).toDateString()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  close() {
    this.productDetails = {}
    this.modalRef?.hide()
  }

  updateProductReview(refid: any) {
    this.ReviewService.updateReview({ refid: refid }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
        this.getProductReviews()
      }
    })
  }

  clearProductFilters() {
    this.productKeyword.setValue('')
    this.productStatus.setValue('')
    this.productLimit.setValue(20)
    this.productPage = 1
    this.getProducts()
  }

  getProducts() {
    this.ProductService.searchProducts({
      name: this.productKeyword?.value,
      isActive: this.productStatus?.value,
      page: this.productPage,
      limit: this.productLimit?.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.products = res?.result?.data
          this.totalProducts = res?.result?.totalResults
          this.isProductLastPage = res?.result?.isLastPage
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }
}
