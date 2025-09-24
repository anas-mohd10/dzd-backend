import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
export class AssetsComponent implements OnInit {
  modalRef?: BsModalRef
  page: number = 1;
  limit: number = 30
  totalPages: number = 1
  totalResults: number = 0
  medias: Array<any> = []
  isLoadingMedias: boolean = false; // Add loading state
  hasLoadedMedias: boolean = false; // Track if media has been loaded
  
  @Input('previewDetails') previewDetails?: string;
  @Input('aspectRatio') aspectRatio: string;
  @Input('previewEnabled') previewEnabled?: boolean;
  @Input('image') image?: any;
  @Input('multiSelect') multiSelect: boolean = false; 
  @Input('lazyLoad') lazyLoad: boolean = true; // Enable lazy loading by default
  @Input('visibilityTrigger') visibilityTrigger?: boolean; // For conditional loading based on tab/section
  @Input('selectedItems') set selectedItems(items: Array<any>) {
    // Clear current selections
    this.selectedMedias.clear();
    this.selectedPaths.clear();
    
    // Add all items from input to selected set
    if (items && items.length > 0) {
      items.forEach(item => {
        if (item && item._id) {
          this.selectedMedias.add(item._id);
        }
        if (item && item.path) {
          this.selectedPaths.add(item.path);
        }
      });
    }
    
    // Trigger change detection
    if (this.ChangeDetectorRef) {
      this.ChangeDetectorRef.markForCheck();
    }
  }
  
  base: string = environment.base
  preview: any;
  files: Array<any> = []
  previews: Array<any> = []
  keyword: FormControl = new FormControl('')
  @Output('mediaClicked') onMediaClicked = new EventEmitter<any>();
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  
  // Add properties to track selected media items
  selectedMedias: Set<string> = new Set<string>();
  selectedPaths: Set<string> = new Set<string>();

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
    // Handle preview logic
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
    
    // Handle visibility trigger changes for conditional loading
    if (changes['visibilityTrigger'] && this.visibilityTrigger && this.lazyLoad && !this.hasLoadedMedias) {
      this.getMedias();
    }
    
    this.ChangeDetectorRef.markForCheck()
  }

  ngOnInit(): void {
    // Remove automatic media loading from ngOnInit for lazy loading
    // Only load media if lazy loading is disabled
    if (!this.lazyLoad) {
      this.getMedias();
    }
    
    // Handle preview logic
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
    // If we're not using the selectedItems input, reset selections when opening
    if (!this.multiSelect) {
      this.selectedMedias.clear();
      this.selectedPaths.clear();
    }
    
    // Lazy load media only when modal opens and hasn't been loaded yet
    if (this.lazyLoad && !this.hasLoadedMedias && !this.isLoadingMedias) {
      this.getMedias();
    }
    
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

  searchAssets() {
    setTimeout(() => {
      this.getMedias()
    }, 800)
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
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let isVideo = file.type.startsWith('video/');
      
      // Log file information
      console.log(`File: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);
      
      let reader = new FileReader();
      reader.onload = (e) => {
        this.previews.push({
          url: e.target?.result,
          title: file.name,
          type: isVideo ? 'video' : 'image',
          fileType: file.type
        });
        this.files.push(file);
        this.ChangeDetectorRef.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }
  
  addMedias() {
    let formdata = new FormData();
    console.log('Files to upload:', this.files); // Log all files being uploaded
    
    for (let file of this.files) {
      console.log(`Adding file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
      formdata.append('file', file);
    }
    
    this.MediaService.addMedias(formdata).subscribe({
      next: (res: any) => {
        console.log('Upload response:', res); // Log full response
        if (res?.errorCode == 0) {
          this.Toast.success(res.message);
          this.modalRef?.hide();
          this.files = [];
          this.previews = [];
          this.getMedias();
        } else {
          this.Toast.error(res.message);
        }
      }, 
      error: (err: any) => {
        console.error('Upload error:', err); // Log detailed error
        this.Toast.error(err.error?.message || 'Failed to upload files');
      }, 
      complete: () => {
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  // Method to manually trigger media loading for conditional scenarios
  loadMediasIfVisible(): void {
    if (!this.hasLoadedMedias && !this.isLoadingMedias) {
      this.getMedias();
    }
  }

  getMedias() {
    // Prevent multiple simultaneous calls
    if (this.isLoadingMedias) {
      return;
    }
    
    this.isLoadingMedias = true;
    this.MediaService.getMedias({ keyword: this.keyword.value, page: this.page, limit: this.limit }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.medias = res?.result?.data;
          this.totalPages = res?.result?.totalPages;
          this.totalResults = res?.result?.totalResults;
          this.hasLoadedMedias = true; // Mark as loaded
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => {
        console.error('Error loading media:', err);
        this.Toast.error('Failed to load media');
      },
      complete: () => {
        this.isLoadingMedias = false;
        this.ChangeDetectorRef.markForCheck();
      }
    })
  }



  // Check if a media item is selected by ID or path
  isMediaSelected(media: Media): boolean {
    return this.selectedMedias.has(media._id) || this.selectedPaths.has(media.path);
  }

  onMediaClickedHandler(media: Media) {
    if (this.multiSelect) {
      // Toggle selection status of the media
      if (this.isMediaSelected(media)) {
        this.selectedMedias.delete(media._id);
        this.selectedPaths.delete(media.path);
      } else {
        this.selectedMedias.add(media._id);
        this.selectedPaths.add(media.path);
      }
      
      this.onMediaClicked.emit(media);
      
      switch (this.previewEnabled) {
        case true:
          this.preview = media;
          break;
        case false:
          this.preview = null;
          break;
        default:
          this.preview = media;
          break;
      }
    } else {
      // For single select, clear previous selection and set new one
      this.selectedMedias.clear();
      this.selectedPaths.clear();
      this.selectedMedias.add(media._id);
      this.selectedPaths.add(media.path);
      
      this.onMediaClicked.emit(media);
      
      switch (this.previewEnabled) {
        case true:
          this.preview = media;
          break;
        case false:
          this.preview = null;
          break;
        default:
          this.preview = media;
          break;
      }
      this.close();
    }
    
    this.ChangeDetectorRef.markForCheck();
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