import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, from, of } from 'rxjs';
import { catchError, concatMap, takeUntil, tap } from 'rxjs/operators';
import { appRoutes } from 'src/app/config/routes';
import { MediaService } from 'src/app/includes/services/media-library.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-media-listing',
  templateUrl: './media-listing.component.html',
  styleUrls: ['./media-listing.component.scss']
})

export class MediaListingComponent implements OnInit, OnDestroy {
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
  isUploading: boolean = false
  uploadProgress: { current: number; total: number; errors: number; errorFiles: string[] } = { current: 0, total: 0, errors: 0, errorFiles: [] }
  private destroy$ = new Subject<void>()
  constructor(
    private MediaService: MediaService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Toast: HotToastService,
    private BsModalService: BsModalService,
    private Sanitizer: DomSanitizer
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
      if (this.checkedMedias.length < 20) {
        this.checkedMedias.push(media)
      } else {
        this.Toast.error('You can only select 20 media at a time')
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

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(e: BeforeUnloadEvent) {
    if (this.isUploading) {
      e.preventDefault();
      e.returnValue = 'Files are still uploading. If you leave, the upload will be cancelled.';
      return e.returnValue;
    }
    return;
  }

  onMediaChange(event: any) {
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let isVideo = file.type.startsWith('video/');
      // Use createObjectURL instead of FileReader to avoid loading all file data into memory.
      // bypassSecurityTrustUrl is needed because Angular sanitizer blocks blob: URLs by default.
      const objectUrl = URL.createObjectURL(file);
      const safeUrl: SafeUrl = this.Sanitizer.bypassSecurityTrustUrl(objectUrl);
      this.previews.push({
        url: safeUrl,
        _blobUrl: objectUrl,
        title: file.name,
        type: isVideo ? 'video' : 'image',
        fileType: file.type
      });
      this.files.push(file);
    }
    this.ChangeDetectorRef.markForCheck();
  }

  cancelMedias() {
    for (const preview of this.previews) {
      URL.revokeObjectURL(preview._blobUrl);
    }
    this.files = []
    this.previews = []
  }

  deleteMedia(index: number) {
    URL.revokeObjectURL(this.previews[index]._blobUrl);
    this.files.splice(index, 1)
    this.previews.splice(index, 1)
    this.ChangeDetectorRef.markForCheck()
  }

  addMedias() {
    if (!this.files.length) return;

    this.isUploading = true;
    this.uploadProgress = { current: 0, total: this.files.length, errors: 0, errorFiles: [] };
    this.modalRef?.hide();

    from(this.files).pipe(
      concatMap((file) => {
        const formdata = new FormData();
        formdata.append('file', file);
        return this.MediaService.addMedias(formdata).pipe(
          catchError(() => {
            this.uploadProgress.errors++;
            this.uploadProgress.errorFiles.push(file.name);
            return of(null);
          })
        );
      }),
      tap(() => {
        this.uploadProgress.current++;
        this.ChangeDetectorRef.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      complete: () => {
        this.isUploading = false;
        for (const preview of this.previews) URL.revokeObjectURL(preview._blobUrl);
        this.files = [];
        this.previews = [];
        this.getMedias();
        if (this.uploadProgress.errors === 0) {
          this.Toast.success(`${this.uploadProgress.total} file(s) uploaded successfully`);
        } else {
          this.Toast.warning(`${this.uploadProgress.total - this.uploadProgress.errors} uploaded, ${this.uploadProgress.errors} failed`);
        }
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    for (const preview of this.previews) URL.revokeObjectURL(preview._blobUrl);
  }

  clear() {
    this.type?.setValue('')
    this.keyword?.setValue('')
    this.date = null
    this.page = 1
    this.limit = 20
    this.getMedias()
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


  // Check if the file is an image
  isImageFile(path: string): boolean {
    if (!path) return false;
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const extension = this.getFileExtension(path).toLowerCase();
    
    return imageExtensions.includes(extension);
  }

  // Check if the file is a video
  isVideoFile(path: string): boolean {
    if (!path) return false;
    
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
    const extension = this.getFileExtension(path).toLowerCase();
    
    return videoExtensions.includes(extension);
  }

  // Get file extension from path
  getFileExtension(path: string): string {
    if (!path) return '';
    
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex === -1) return '';
    
    return path.substring(lastDotIndex + 1);
  }

}