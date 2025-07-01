import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { Album, AlbumService } from 'src/app/includes/services/album.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

interface Settings {
  isGalleryEnabled: boolean
  isShuffledGallery: boolean
}

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
  modalRef?: BsModalRef;
  confirmationRef?: BsModalRef;
  albums: Album[] = [];
  settings: Settings = { isGalleryEnabled: false, isShuffledGallery: false }
  pageIndex: number = 1;
  pageSize: number = 10;
  totalResults: number = 0;
  totalPages: number = 0;
  isSubmitted: boolean = false;
  appRoute = appRoutes
  toggledAlbum: string | null = null
  isEditMode: boolean = false;
  form: FormGroup = new FormGroup({})

  get formControls() {
    return this.form.controls;
  }

  constructor(
    private AlbumService: AlbumService,
    private AppSettingsService: AppSettingsService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  fetchSettings() {
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

  settingsToggled(event: { toggleState: boolean, switchId: string }) {
    this.AppSettingsService.updateSettings({ [event.switchId]: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.fetchSettings()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  open(template: TemplateRef<any>, type: string = 'create', albumId: string = '') {
    if (type == 'update') {
      this.toggledAlbum = albumId
      this.isEditMode = true
      this.AlbumService.getAlbum(albumId).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.form.patchValue(res.result)
            this.ChangeDetectorRef.markForCheck()
          } else {
            this.HotToastService.error(res.message)
          }
        }, error: (err: any) => {
          this.HotToastService.error(err.error.message)
        }
      })
    }

    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true
    })
  }

  onMediaTriggered(event: { path: string }) {
    this.form.patchValue({ thumbnail: event.path })
  }

  onSwitchToggled(event: { toggleState: boolean, switchId: string }) {
    const albumDoc: Album | undefined = this.albums.find(album => album._id == event.switchId)
    if (albumDoc) {
      this.AlbumService.updateAlbum(event.switchId, { ...albumDoc, isActive: event.toggleState }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.fetchResults()
            this.HotToastService.success(res.message)
          } else {
            this.HotToastService.error(res.message)
          }
        }, error: (err: any) => {
          this.HotToastService.error(err.error.message)
        }
      })
    } else {
      this.HotToastService.error('Album not found')
    }
  }

  confirmation(template: TemplateRef<any>, albumId: string) {
    this.toggledAlbum = albumId
    this.confirmationRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true
    })
  }

  confirm() {
    this.AlbumService.deleteAlbum(this.toggledAlbum).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.fetchResults()
          this.confirmationRef?.hide()
          this.toggledAlbum = null
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  decline() {
    this.confirmationRef?.hide()
  }

  close() {
    this.modalRef?.hide()
    this.form.reset()
    this.isEditMode = false
    this.toggledAlbum = null
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      thumbnail: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      description: new FormControl('')
    })

    this.fetchResults()
    this.fetchSettings()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchResults()
  }

  fetchResults() {
    this.AlbumService.searchAlbums(this.pageIndex, this.pageSize).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.albums = res.result.albums;
          this.totalResults = res.result.totalResults;
          this.totalPages = res.result.totalPages;
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
    if (!this.form.valid) {
      this.isSubmitted = true
      this.HotToastService.error('Please fill all the required fields')
      return
    }

    if (this.isEditMode) {
      this.updateAlbum()
    } else {
      this.createAlbum()
    }
  }

  createAlbum() {
    this.AlbumService.createAlbum(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.pageIndex = 1
          this.pageSize = 10
          this.fetchResults()
          this.close()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  updateAlbum() {
    this.AlbumService.updateAlbum(this.toggledAlbum, this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.pageIndex = 1
          this.pageSize = 10
          this.fetchResults()
          this.close()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }
}
