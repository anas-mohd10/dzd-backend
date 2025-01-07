import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { toastKeys } from 'src/app/config/constants/toast-keys';
import { appRoutes } from 'src/app/config/routes';
import { ToastService } from 'src/app/includes/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  appRoute = appRoutes;
  language: FormControl = new FormControl('en');
  toastKeys: Array<any> = [];
  modalRef?: BsModalRef;
  details: any;

  constructor(
    private ToastService: ToastService,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.rawLangKeys();
    this.getDetails();
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  decline() {
    this.modalRef?.hide();
  }

  confirm() {
    const jsonObject = this.toastKeys.reduce(
      (acc: any, item: { key: string; value: string }) => {
        acc[item.key] = item.value;
        return acc;
      },
      {}
    );

    if (this.details) {
      this.ToastService.updateToast({
        _id: this.details?._id,
        lang: this.language.value,
        json: jsonObject,
      }).subscribe({
        next: (res: any) => {
          this.onResponse(res);
        },
        error: (err: any) => {
          this.HotToastService.error(err?.error?.message);
        },
      });
    } else {
      this.ToastService.createToast({
        lang: this.language.value,
        json: jsonObject,
      }).subscribe({
        next: (res: any) => {
          this.onResponse(res);
        },
        error: (err: any) => {
          this.HotToastService.error(err?.error?.message);
        },
      });
    }
  }

  onResponse(res: any) {
    if (res?.errorCode == 0) {
      this.modalRef?.hide();
      this.getDetails();
      this.HotToastService.success(res?.message);
    } else {
      this.HotToastService.error(res?.message);
    }
  }

  getDetails() {
    this.toastKeys = [];
    this.rawLangKeys();
    this.ToastService.getToast(
      this.language.value
    ).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result;
          if (res?.result?.json) {
            for (let key of Object.keys(res?.result?.json)) {
              this.updateOrAddKey(this.toastKeys, key, res?.result?.json[key]);
            }
          } else {
            this.rawLangKeys();
          }
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => {},
    });
  }

  updateOrAddKey(toastKeys: Array<any>, langKey: string, newValue: string) {
    const existingEntry = toastKeys.find((item) => item.key === langKey);
    if (existingEntry) {
      existingEntry.value = newValue;
    } else {
      toastKeys.push({ key: langKey, value: '' });
    }
  }

  rawLangKeys() {
    for (let toasKey of Object.keys(toastKeys)) {
      this.toastKeys.push({ key: toasKey, value: '' });
    }
  }
}
