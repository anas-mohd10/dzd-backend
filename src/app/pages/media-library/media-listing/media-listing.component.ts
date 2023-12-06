import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { MediaService } from 'src/app/includes/services/media-library.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-media-listing',
  templateUrl: './media-listing.component.html',
  styleUrls: ['./media-listing.component.scss']
})

export class MediaListingComponent implements OnInit {
  appRoute = appRoutes
  page: number = 1
  limit: FormControl = new FormControl('40')
  lastPage: boolean = false
  medias: Array<any> = []
  totalPages: number = 1
  totalResults: number = 0
  base: string = environment.base
  checkedMedias: Array<any> = []
  date: any
  keyword: FormControl = new FormControl('')
  type: FormControl = new FormControl('')

  constructor(
    private MediaService: MediaService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getMedias()
  }

  navNext() {
    this.page++
    this.getMedias()
  }

  navBack() {
    this.page--
    this.getMedias()
  }

  check(media: string) {
    this.checkedMedias.includes(media) ?
      this.checkedMedias = this.checkedMedias.filter(item => item != media) :
      this.checkedMedias.push(media)
  }

  getMedias() {
    this.MediaService.getMedias({ page: this.page, limit: this.limit.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.medias = res?.result?.data
          for(let media of this.medias) media.createdAt = new Date(media.createdAt).toDateString() + ' ' + new Date(media.createdAt).toLocaleTimeString()
          this.lastPage = res?.result?.lastPage
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.error.message)
        this.medias = []
      }, complete: () => {
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
