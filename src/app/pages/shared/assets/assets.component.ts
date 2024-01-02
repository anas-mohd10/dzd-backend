import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MediaService } from 'src/app/includes/services/media-library.service';
import { environment } from 'src/environments/environment';

interface Media {
  title: string;
  _id: string;
  size: string;
  path: string;
  slug: string;
}

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  modalRef?: BsModalRef
  page: number = 1;
  limit: number = 10
  totalPages: number = 1
  totalResults: number = 0
  medias: Array<any> = []
  @Input('url') url?: string;
  base: string = environment.base + '/'
  preview: any;
  @Output('mediaClicked') onMediaClicked = new EventEmitter<any>();

  constructor(
    private MediaService: MediaService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMedias()
    this.url ? this.preview = { url: this.url } : null
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
    this.preview = media
    this.close()
  }
}
