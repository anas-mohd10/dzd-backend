import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { MediaService } from 'src/app/includes/services/media-library.service';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import { HotToastService } from '@ngneat/hot-toast';
import { mediaEndpoints } from 'src/app/config/endpoints';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-media-details',
  templateUrl: './media-details.component.html',
  styleUrls: ['./media-details.component.scss']
})
export class MediaDetailsComponent implements OnInit {
  appRoute = appRoutes;
  mediaDetails: any = {};
  mediaQuery: string;
  base: string = environment.base;
  mediaUrl: FormControl = new FormControl('');
  title: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[^.]*$/)],);
  altTitle: FormControl = new FormControl('');
  isSubmitted: boolean = false;
  timestamp: string
  mediaDownload: string;
  mediaPath: string = ''

  constructor(
    private MediaService: MediaService,
    private ActivatedRoute: ActivatedRoute,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ClipboardService: ClipboardService,
    private Toast: HotToastService,
    private Router: Router,
    private HttpClient: HttpClient
  ) { }


  ngOnInit(): void {
    this.mediaQuery = this.ActivatedRoute.snapshot.params.media || ''
    this.getMediaDetails()
    this.mediaDownload = environment.base + `/${this.mediaQuery}`
  }

  getMediaDetails() {
    this.MediaService.getMediaDetails(this.mediaQuery).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.mediaDetails = res?.result
          this.mediaDetails.createdAt = new Date(this.mediaDetails.createdAt).toDateString() + ", " + new Date(this.mediaDetails.createdAt).toLocaleTimeString()
          this.mediaPath = this.mediaDetails.path
          this.mediaDetails.path = this.base + this.mediaDetails.path
          this.mediaUrl.setValue(this.mediaDetails.path)
          let match = this.mediaDetails.title.match(/^\d+-/);
          this.timestamp = match ? match[0] : '';
          this.title.setValue(this.mediaDetails.title.split('.')[0].replace(/^\d+-/, ''))
          this.altTitle.setValue(this.mediaDetails.altTitle)
          this.mediaUrl.disable()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.error.message)
      }, complete: () => {
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  downloadImage(url: string) {
    this.HttpClient.get(`${environment.apiUrl}/medias-file/${this.mediaQuery}`).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0 && res?.result?.url) {
          const link = document.createElement('a');
          link.href = res.result.url;
          link.download = this.mediaDetails.originalName || this.mediaDetails.title;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          this.Toast.error('Failed to get download URL');
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message || 'Failed to download file');
      }
    });
  }

  saveDetails() {
    if (!this.title.valid) {
      this.isSubmitted = true
      return
    }

    this.MediaService.updateMedia(this.mediaQuery, {
      title: `${this.timestamp}` + this.title.value + `.${this.mediaDetails.path.split('.')[1]}`,
      altTitle: this.altTitle.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }, complete: () => {
        this.getMediaDetails()
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  copyToClipboard() {
    this.ClipboardService.copyFromContent(this.mediaUrl.value)
    this.Toast.success('Copied to clipboard')
  }

  deleteMedia() {
    this.MediaService.deleteMedias({
      files: [{ path: this.mediaPath, slug: this.mediaDetails.slug }]
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.Router.navigateByUrl(this.appRoute.mediaLibrary)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
}
