import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MediaService } from 'src/app/includes/services/media-library.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  modalRef?: BsModalRef
  page: number = 1;
  limit: number = 20
  totalPages: number = 1
  totalResults: number = 0
  medias: Array<any> = []

  constructor(
    private MediaService: MediaService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMedias()
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true })
  }

  close() {
    this.modalRef?.hide()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getMedias()
  }

  getMedias() {
    this.MediaService.getMedias({ page: this.page, limit: this.limit }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.medias = res?.data?.data;
          this.totalPages = res?.data?.totalPages;
          this.totalResults = res?.data?.totalResults;
          this.ChangeDetectorRef.markForCheck();
        }
      }, error: (err: any) => {

      }
    })
  }

}
