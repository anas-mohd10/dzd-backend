import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { BannerImagesService } from 'src/app/includes/services/banner.images.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-banner-images',
  templateUrl: './banner-images.component.html',
  styleUrls: ['./banner-images.component.scss']
})
export class BannerImagesComponent implements OnInit {
  appRoute = appRoutes;
  bannerImages: Array<any> = [];
  deleteRef?: BsModalRef;
  duplicateRef?: BsModalRef;
  manageRef?: BsModalRef;
  bannerImageDetails: any;
  @ViewChild('duplicateTemplate') duplicateModal: TemplateRef<any>;
  isEditMode: boolean = true;
  form: FormGroup
  isSubmitted: boolean = false;
  focusedBannerImage: any;
  base: string = environment.base + '/';
  previewDetails: any;  // for previewing image
  items: Array<any> = [
    { key: 'Cart in Web', value: 'cart-web' },
    { key: 'Cart in Mobile', value: 'cart-mobile' },
    { key: 'Product details in Web', value: 'productdetails-web' },
    { key: 'Product details in Mobile', value: 'productdetails-mobile' },
  ]

  constructor(
    private BannerImagesService: BannerImagesService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      media: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
    })

    this.searchBannerImages()
  }

  openManage(type: string, template: TemplateRef<any>, bannerImage?: any) {
    type == 'add' ? this.isEditMode = false : this.bannerImageDetails = bannerImage;
    if (type == 'update') {
      this.form.patchValue(this.bannerImageDetails)
      this.isEditMode = true;
      this.previewDetails = this.bannerImageDetails?.media?.path
    }
    this.manageRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
  }

  closeManage() {
    this.manageRef?.hide();
    this.isEditMode = true
    this.bannerImageDetails = null;
    this.form.reset();
    this.form.get("type")?.setValue("");
    this.previewDetails = null;
  }

  closeDuplicate() {
    this.duplicateRef?.hide();
    this.isEditMode = true
    this.bannerImageDetails = null;
    this.form.reset();
    this.form.get("type")?.setValue("");
    this.previewDetails = null;
  }

  openDelete(template: TemplateRef<any>, bannerImage: any) {
    this.focusedBannerImage = bannerImage;
    this.deleteRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });
  }

  confirm() {
    this.BannerImagesService.deleteBannerImage(this.focusedBannerImage?.refid).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.deleteRef?.hide();
          this.searchBannerImages();
        } else {
          this.Toast.error(res?.message);
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message);
      }
    })
  }

  decline() {
    this.deleteRef?.hide();
    this.focusedBannerImage = null;
  }

  onMediaTriggered(event: any) {
    this.form.patchValue({ media: event?._id })
  }

  searchBannerImages() {
    this.BannerImagesService.searchBannerImages().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.bannerImages = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.Toast.error(res?.errorMessage);
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message);
      }
    })
  }

  submit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    if (this.isEditMode) {
      this.update()
    } else {
      this.add()
    }
  }

  update() {
    this.BannerImagesService.updateBannerImage({ ...this.form.value, refid: this.bannerImageDetails?.refid }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.closeManage();
          this.duplicateRef?.hide();
          this.searchBannerImages();
        } else {
          this.Toast.error(res?.message);
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message);
      }
    })
  }

  add() {
    this.BannerImagesService.createBannerImage(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.closeManage();
          this.searchBannerImages();
        } else {
          this.duplicateRef = this.BsModalService.show(this.duplicateModal, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });
          this.bannerImageDetails = res?.result;
          this.Toast.error(res?.message);
          this.manageRef?.hide();
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message);
      }
    })
  }
}
