import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { MediaService } from 'src/app/includes/services/media-library.service';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard';

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

  constructor(
    private MediaService: MediaService,
    private ActivatedRoute: ActivatedRoute,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ClipboardService: ClipboardService
  ) { }

  ngOnInit(): void {
    this.mediaQuery = this.ActivatedRoute.snapshot.params.media || ''
    this.MediaService.getMediaDetails(this.mediaQuery).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.mediaDetails = res?.result
          this.mediaDetails.createdAt = new Date(this.mediaDetails.createdAt).toDateString() + ", " + new Date(this.mediaDetails.createdAt).toLocaleTimeString()
          this.mediaDetails.path = this.base + '/' + this.mediaDetails.path
          this.mediaUrl.setValue(this.mediaDetails.path)
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

  copyToClipboard() {
    this.ClipboardService.copyFromContent(this.mediaUrl.value)
    this.ToastrService.success('Copied to clipboard')
  }
}
