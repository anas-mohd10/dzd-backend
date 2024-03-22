import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { GuestCustomersService } from 'src/app/includes/services/guest.customers.service';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.scss']
})
export class GuestsComponent implements OnInit {
  page: number = 1;
  limit: number = 20;
  guests: Array<any> = [];
  appRoute = appRoutes;
  keyword: FormControl = new FormControl("");
  totalResults: number;
  totalPages: number;

  constructor(
    private GuestCustomersService: GuestCustomersService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.searchGuests()
  }

  onPageTriggered(event: { pageIndex: number, pageLimit: number }) {
    this.page = event.pageIndex;
    this.limit = event.pageLimit;
    this.searchGuests();
  }

  searchGuests() {
    this.GuestCustomersService.searchGuests(this.page, this.limit, this.keyword.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.guests = res?.result?.data;
          this.totalPages = res?.result?.totalPages;
          this.totalResults  = res?.result?.totalResults
          this.ChangeDetectorRef.markForCheck();
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

}
