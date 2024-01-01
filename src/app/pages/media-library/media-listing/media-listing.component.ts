import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  limit: number = 20
  lastPage: boolean = false
  medias: Array<any> = []
  totalPages: number = 1
  totalResults: number = 0
  base: string = environment.base
  checkedMedias: Array<any> = []
  date: any
  keyword: FormControl = new FormControl('')
  type: FormControl = new FormControl('')
  modalRef?: BsModalRef
  deleteRef?: BsModalRef
  urls: FormControl = new FormControl('', [Validators.required])
  isUrlSubmitted: boolean = false
  files: Array<any> = []
  previews: Array<any> = []

  constructor(
    private MediaService: MediaService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Toast: HotToastService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getMedias()
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true })
  }

  onPageTrigger(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = Number(event.pageSize)
    this.getMedias()
  }

  selectMedia(media: string) {
    if (this.checkedMedias.includes(media)) {
      this.checkedMedias = this.checkedMedias.filter(item => item != media)
    } else {
      if (this.checkedMedias.length < 10) {
        this.checkedMedias.push(media)
      } else {
        this.Toast.error('You can only select 10 media at a time')
      }
    }
  }

  getMedias() {
    this.MediaService.getMedias({
      page: this.page, limit: this.limit,
      type: this.type.value, date: this.date,
      keyword: this.keyword.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.medias = res?.result?.data
          for (let media of this.medias) media.createdAt = new Date(media.createdAt).toDateString() + ' ' + new Date(media.createdAt).toLocaleTimeString()
          this.lastPage = res?.result?.lastPage
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.error.message)
        this.medias = []
      }, complete: () => {
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  saveUrls() {
    if (!this.urls.valid) {
      this.isUrlSubmitted = true
      return
    }

    this.MediaService.saveMediaUrls({ urls: this.urls.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res.message)
          this.modalRef?.hide()
          this.urls.reset()
          this.getMedias()
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.error.message)
      }, complete: () => {
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  onMediaChange(event: any) {
    let file = event.target.files[0]
    let reader = new FileReader()
    reader.onload = (e) => {
      this.previews.push({
        url: e.target?.result,
        title: file.name
      })
      this.files.push(file)
    }
    reader.readAsDataURL(file)
    this.ChangeDetectorRef.markForCheck()
  }

  cancelMedias() {
    this.files = []
    this.previews = []
  }

  deleteMedia(index: number) {
    this.files.splice(index, 1)
    this.previews.splice(index, 1)
    this.ChangeDetectorRef.markForCheck()
  }

  addMedias() {
    let formdata = new FormData()
    for (let file of this.files) formdata.append('file', file)
    this.MediaService.addMedias(formdata).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res.message)
          this.modalRef?.hide()
          this.files = []
          this.previews = []
          this.getMedias()
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.error.message)
      }, complete: () => {
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  deleteMedias() {
    let medias = []
    for (let media of this.medias) if (this.checkedMedias.includes(media.slug)) medias.push({
      path: media.path, slug: media.slug
    })
    this.MediaService.deleteMedias({ files: medias }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.checkedMedias = []
          this.Toast.success(res.message)
          this.getMedias()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.error.message)
      }
    })
  }
}