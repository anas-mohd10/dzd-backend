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
  lastPage: Boolean = false
  review: FormControl = new FormControl('')
  data: any = {}

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private toastr: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getReviews()
  }

  updateReview(data: any) {
  }

  selectReview(data: any) { this.data = data }

  getReviews() {
    let payload = {
      page: this.page,
      limit: this.limit?.value,
      keyword: this.keyword?.value,
      isActive: this.isActive?.value,
      fromDate: this.fromDate?.value,
      toDate: this.toDate?.value
    }

    this.reviewService.searchReviews(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.reviews = res?.result?.data
        for (let data of this.reviews) data.created = new Date(data?.created).toDateString()
        this.page = res?.result?.page
        this.lastPage = res?.result?.lastPage
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  getPreviousPage() {
    this.page -= this.page
    this.getReviews()
  }

  getNextPage() {
    this.page += this.page
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
