import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes';
import { ReviewService } from 'src/app/includes/services/review.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes
  reviewsData: any
  data: any

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getReviews()
  }

  getReviews() {
    this.reviewService.getReviews().subscribe((res: any) => {
      this.reviewsData = res?.result
      for (let review of this.reviewsData) {
        review.created = new Date(review.created).toDateString()
      }
    })
  }

  reviewAction(event: any, code: any) {
    let state = event.checked
    this.data = {
      isActive: state
    }
    this.reviewService.updateReview(code, this.data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        window.location.reload()
      }
    })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
