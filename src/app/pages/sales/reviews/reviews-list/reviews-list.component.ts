import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { ReviewService } from 'src/app/includes/services/review.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
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

  constructor(
    private ReviewService: ReviewService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getReviews()
  }

  updateReview(data: any) {
    this.ReviewService.updateReview({ refid: data }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
        this.getReviews()
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

  clearFilters() {
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.fromDate.setValue('')
    this.toDate.setValue('')
    this.getReviews()
    this.limit.setValue(20)
    this.page = 1
  }
}
