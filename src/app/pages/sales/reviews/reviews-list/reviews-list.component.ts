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

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private toastr: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.searchReviews()
  }

  reviewAction() {
    // let state = event.checked
    // this.data = {
    //   isActive: state
    // }
    // this.reviewService.updateReview(code, this.data).subscribe((res: any) => {
    //   if (res.errorCode != 0) {
    //     this.toastr.error(res?.message);
    //   } else if (res.errorCode == 0) {
    //     this.toastr.success(res?.message);
    //     document.location.reload()
    //   }
    // })
  }

  searchReviews() {
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
        for (let review of this.reviews) review.created = new Date(review?.created).toDateString()
        this.page = res?.result?.page
        this.lastPage = res?.result?.lastPage
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  getPreviousPage() {
    this.page -= this.page
    this.searchReviews()
  }

  getNextPage() {
    this.page += this.page
    this.searchReviews()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.fromDate.setValue('')
    this.toDate.setValue('')
    this.searchReviews()
    this.limit.setValue(20)
    this.page = 1
  }
}
