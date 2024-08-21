import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
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
  isPickUp: FormControl = new FormControl(false)
  locations: Array<any> = []

  constructor(
    private PickupService: PickupService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.getSettings()
    this.searchLocations()
  }

  enablePickUp(event: { toggleState: boolean, switchId: string }) {
    this.isPickUp.setValue(event.toggleState)
    this.AppSettingsService.updateSettings({ isPickUp: this.isPickUp.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.getSettings()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.isPickUp.setValue(res?.result?.isPickUp)
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.searchLocations()
  }

  onSwitchChange(event: { toggleState: boolean, switchId: string }) {
    this.PickupService.update(event.switchId, { isActive: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.searchLocations()
          this.HotToastService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  onDelete(pickupId: string) {
    this.PickupService.delete(pickupId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.searchLocations()
          this.HotToastService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  searchLocations() {
    setTimeout(() => {
      this.PickupService.search({
        page: this.page,
        limit: this.limit,
        isActive: this.isActive.value,
        name: this.name.value
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.locations = res?.result?.data
            this.totalPages = res?.result?.totalPages
            this.totalResults = res?.result?.totalResults
            this.isLastPage = res?.result?.isLastPage
            this.ChangeDetectorRef.markForCheck()
          } else { }
        }, error: (err: any) => { }
      })
    }, 800)
  }

}
