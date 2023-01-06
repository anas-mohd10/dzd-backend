import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  reviews: any = []
  data: any

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private toastr: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getReviews()

    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
  }

  getReviews() {
    this.reviewService.getReviews().subscribe((res: any) => {
      this.reviews = res?.result
      for (let review of this.reviews) {
        review.created = new Date(review.created).toDateString()
      }
      this.ChangeDetectorRef.markForCheck()
      this.dtTrigger.next()
    })
  }

  reviewAction(event: any, code: any) {
    let state = event.checked
    this.data = {
      isActive: state
    }
    this.reviewService.updateReview(code, this.data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        document.location.reload()
      }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
