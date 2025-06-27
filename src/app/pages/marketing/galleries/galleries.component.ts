

import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { debounceTime } from 'rxjs/operators';
import { appRoutes } from 'src/app/config/routes';
import { Album, AlbumService } from 'src/app/includes/services/album.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { MediaService } from 'src/app/includes/services/media-library.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CarouselModule } from 'ngx-bootstrap/carousel';

interface Settings {
  isGalleryEnabled: boolean
  isShuffledGallery: boolean
}

interface GalleryItem {
  _id: string
  media: string
  videoUrl?: string
  type: string
  album: {
    title: string
    slug: string
  }
}

interface Media {
  path: string
  type: string
}

interface UploadType {
  label: string
  value: string
}

@Component({
  selector: 'app-galleries',
  templateUrl: './galleries.component.html',
  styleUrls: ['./galleries.component.scss']
})
export class GalleriesComponent implements OnInit {
  appRoute = appRoutes
  settings: Settings = { isGalleryEnabled: false, isShuffledGallery: false }
  albumId: string = ''
  album: Album | null = null
  medias: Media[] = []
  assets: Media[] = []
  assetKeyword: FormControl = new FormControl('')
  uploadTypes: UploadType[] = [
    { label: 'Assets', value: 'assets' },
    { label: 'Videos', value: 'videos' },
  ]
  baseUrl: string = environment.base
  videoUrls: FormControl = new FormControl('')
  uploadType: FormControl = new FormControl('')
  modalRef?: BsModalRef = new BsModalRef()
  carouselRef?: BsModalRef = new BsModalRef()
  tabIndex: number = 0
  pageIndex: number = 1
  pageSize: number = 20
  totalPages: number = 1
  totalResults: number = 0

  page: number = 1
  size: number = 50
  pages: number = 1
  results: number = 0
  galleries: GalleryItem[] = []

  constructor(
    private AlbumService: AlbumService,
    private MediaService: MediaService,
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private ActivatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.assetKeyword.valueChanges.pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.fetchAssets()
      })
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }, type: string = 'assets') {
    if (type == 'assets') {
      this.pageIndex = event.pageIndex
      this.pageSize = event.pageSize
      this.fetchAssets()
    } else {
      this.page = event.pageIndex
      this.size = event.pageSize
      this.fetchGallery()
    }
  }

  fetchAssets() {
    this.MediaService.getMedias({
      page: this.pageIndex,
      limit: this.pageSize,
      type: "image",
      keyword: this.assetKeyword.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.assets = res?.result?.data
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  onUploadTypeChange(event: any) {
    if (this.uploadType.value === 'assets') {
      this.fetchAssets()
    }
  }

  onAssetSelect(event: Media) {
    if (this.medias.length >= 20) {
      this.HotToastService.error('You can only select up to 20 assets')
      return false
    }
    if (this.isSelected(event)) {
      this.medias = this.medias.filter((media: Media) => media.path !== event.path)
    } else {
      this.medias.push(event)
    }
  }

  isSelected(asset: Media) {
    return this.medias.some((media: Media) => media.path === asset.path)
  }

  back() {
    this.tabIndex = 0
    this.videoUrls.patchValue('')
    this.assetKeyword.patchValue('')
    this.assets = []
    this.uploadType.patchValue('')
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  openCarousel(template: TemplateRef<any>) {
    this.carouselRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' })
  }

  deleteGallery(gallerId: string) {
    this.AlbumService.deleteGallery(gallerId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.fetchGallery()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  close() {
    this.modalRef?.hide()
    this.uploadType.patchValue('')
    this.medias = []
    this.assetKeyword.patchValue('')
    this.assets = []
    this.tabIndex = 0
    this.videoUrls.patchValue('')
  }

  getImageUrl(gallery: GalleryItem) {
    if (gallery.type == 'video') {
      console.log(gallery.media)
      return gallery.media
    }
    return this.baseUrl + gallery.media
  }

  ngOnInit(): void {
    this.albumId = this.ActivatedRoute.snapshot.params['albumId'] || ''
    this.fetchAlbum()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  fetchAlbum() {
    this.AlbumService.getAlbum(this.albumId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.album = res.result
          this.fetchGallery()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  fetchGallery() {
    this.AlbumService.searchGalleries(this.album?.slug, this.page, this.size).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.galleries = res.result.galleries
          this.pages = res.result.totalPages
          this.results = res.result.totalResults
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  saveChanges() {
    if (this.uploadType.value === 'assets' && this.medias.length === 0) {
      this.HotToastService.error('Please select at least one asset to continue')
      return false
    }

    if (this.uploadType.value === 'videos' && !this.videoUrls.value) {
      this.HotToastService.error('Please enter at least one video URL to continue')
      return false
    }

    const albumData = {
      title: this.album?.title ?? '',
      slug: this.album?.slug ?? ''
    }

    const galleryItems: GalleryItem[] = this.uploadType.value === 'videos'
      ? this.videoUrls.value.split(',').map((url: string) => ({ media: url, type: 'video', album: albumData }))
      : this.medias.map(media => ({ media: media.path, type: "image", album: albumData }))

    this.AlbumService.createGallery({ medias: galleryItems }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.close()
          this.fetchGallery()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  getSafeVideoUrl(url: string | undefined): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url ?? '');
  }

  get imageGalleries() {
    return this.galleries.filter(gallery => gallery.type === 'image');
  }
}

