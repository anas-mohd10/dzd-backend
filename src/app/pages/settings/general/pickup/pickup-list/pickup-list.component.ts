import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { PickupService } from 'src/app/includes/services/pickup.service';

@Component({
  selector: 'app-pickup-list',
  templateUrl: './pickup-list.component.html',
  styleUrls: ['./pickup-list.component.scss']
})
export class PickupListComponent implements OnInit {
  appRoute = appRoutes;
  page: number = 1
  limit: number = 20
  totalPages: number = 1
  totalResults: number = 0
  name: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  isLastPage: boolean = false

  constructor(
    private PickupService: PickupService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.searchLocations()
  }

  searchLocations() {
    this.PickupService.search({ 
      page: this.page, 
      limit: this.limit,
      isActive: this.isActive.value,
      name: this.name.value
     }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {

          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

}
