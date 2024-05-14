import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { PageCoversService } from 'src/app/includes/services/page.covers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page-covers',
  templateUrl: './page-covers.component.html',
  styleUrls: ['./page-covers.component.scss']
})
export class PageCoversComponent implements OnInit {
  appRoute = appRoutes;
  modalRef?: BsModalRef;
  desktop: string = '';
  mobile: string = '';
  details: any;
  isEditMode: boolean = false;
  form: FormGroup = new FormGroup({});
  pages: Array<any> = [
    { title: 'About Us', path: '/about' },
    { title: 'Contact Us', path: '/contact-us' },
    { title: 'Stores', path: '/stores' },
    { title: 'Reviews', path: '/reviews' },
    { title: 'FAQs', path: '/faq' }
  ];
  pageCovers: Array<any> = [];
  isSubmitted: boolean = false;

  constructor(
    private BsModalService: BsModalService,
    private PageCoversService: PageCoversService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.fetchPageCovers()
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      path: new FormControl('', Validators.required),
      desktopCover: new FormControl(null),
      mobileCover: new FormControl(null),
      isActive: new FormControl(true)
    })
  }

  fetchPageCovers() {
    this.PageCoversService.pageCovers({}).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.pageCovers = res?.result;
          this.ChangeDetectorRef.detectChanges();
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  setPath() {
    for (let page of this.pages) {
      if (page.title == this.form.value.title) {
        this.form.get('path')?.setValue(page.path)
        this.ChangeDetectorRef.markForCheck()
      }
    }
  }

  delete() {
    this.PageCoversService.deletePageCover(this.details._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.close()
          this.fetchPageCovers()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  open(template: TemplateRef<any>, pageCover?: any) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered modal-lg', ignoreBackdropClick: true });
    if (pageCover) {
      this.details = pageCover;
      this.isEditMode = true
      this.form.patchValue(pageCover);
      this.desktop = pageCover.desktopCover.path;
      this.mobile = pageCover.mobileCover.path;
    }
  }

  onMediaTriggered(type: string, event: any) {
    if (type == 'desktop') {
      this.form.get('desktopCover')?.setValue(event._id)
    } else {
      this.form.get('mobileCover')?.setValue(event._id)
    }
  }

  onSubmit() {
    this.isEditMode ? this.updatePageCover() : this.addPageCover();
  }

  addPageCover() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.PageCoversService.createPageCover(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.close()
          this.fetchPageCovers()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  updatePageCover() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.PageCoversService.updatePageCover({ ...this.form.value, _id: this.details._id }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.close()
          this.fetchPageCovers()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  close() {
    this.modalRef?.hide();
    this.form.reset();
    this.desktop = '';
    this.mobile = '';
    this.details = null;
    this.isEditMode = false;
    this.form.get('isActive')?.setValue(true)
    this.form.get('title')?.setValue("")
  }

  onToggled(event: { switchId: string, toggleState: boolean }) {
    this.PageCoversService.updatePageCover({ _id: event.switchId, isActive: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.fetchPageCovers()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }
}
