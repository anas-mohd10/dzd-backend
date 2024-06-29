import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { MediaService } from 'src/app/includes/services/media-library.service';
import { environment } from 'src/environments/environment';

interface Media {
  title: string;
  _id: string;
  size: string;
  path: string;
  slug: string;
  tag: string;
  type: string;
  uploadedBy: string;
  uploadedDescription: string;
  uploadedTo: string;
  createdAt: string;
}

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit, OnChanges {
  modalRef?: BsModalRef
  page: number = 1;
  limit: number = 50
  totalPages: number = 1
  totalResults: number = 0
  medias: Array<any> = []
  @Input('previewDetails') previewDetails?: string;
  @Input('aspectRatio') aspectRatio: string;
  @Input('previewEnabled') previewEnabled?: boolean;
  @Input('image') image?: any;
  base: string = environment.base
  preview: any;
  files: Array<any> = []
  previews: Array<any> = []
  @Output('mediaClicked') onMediaClicked = new EventEmitter<any>();
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;

  selectTab(tabId: number) {
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
    }
  }

  constructor(
    private MediaService: MediaService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Toast: HotToastService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.previewEnabled) {
      case true:
        this.previewDetails ? this.preview = { path: this.previewDetails } : this.preview = null
        break
      case false:
        this.preview = null
        break
      default:
        this.previewDetails ? this.preview = { path: this.previewDetails } : this.preview = null
        break
    }
    this.ChangeDetectorRef.markForCheck()
  }

  ngOnInit(): void {

    console.log(this.base)

    this.getMedias()
    switch (this.previewEnabled) {
      case true:
        this.previewDetails ? this.preview = { path: this.previewDetails } : this.preview = null
        break
      case false:
        this.preview = null
        break
      default:
        this.previewDetails ? this.preview = { path: this.previewDetails } : this.preview = null
        break
    }
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true })
  }

  close() {
    this.modalRef?.hide()
  }

  onPageTriggered(event: any) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getMedias()
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

  addMedias() {
    let formdata = new FormData()
    for (let file of this.files) formdata.append('file', file)
    this.MediaService.addMedias(formdata).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res.message)
          this.getMedias()
          this.selectTab(0)
          this.files = []
          this.previews = []
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


  getMedias() {
    this.MediaService.getMedias({ page: this.page, limit: this.limit }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.medias = res?.result?.data;
          this.totalPages = res?.result?.totalPages;
          this.totalResults = res?.result?.totalResults;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    })
  }

  onMediaClickedHandler(media: Media) {
    this.onMediaClicked.emit(media)
    switch (this.previewEnabled) {
      case true:
        this.preview = media
        break
      case false:
        this.preview = null
        break
      default:
        this.preview = media
        break
    }
    this.close()
  }
}
