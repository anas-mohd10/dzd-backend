import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { internationalisationKeys } from 'src/app/config/constants/internationalisation-keys';
import { appRoutes } from 'src/app/config/routes';
import { InternationalisationService } from 'src/app/includes/services/internationalisation.service';

@Component({
  selector: 'app-internationalisation',
  templateUrl: './internationalisation.component.html',
  styleUrls: ['./internationalisation.component.scss']
})
export class InternationalisationComponent implements OnInit {
  appRoute = appRoutes
  language: FormControl = new FormControl('en')
  langKeys: Array<any> = []
  modalRef?: BsModalRef
  details: any;

  constructor(
    private InternationalisationService: InternationalisationService,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.rawLangKeys()
    this.getDetails()
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' });
  }

  confirm() {
    const jsonObject = this.langKeys.reduce((acc: any, item: { key: string, value: string }) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    if (this.details) {
      this.InternationalisationService.updateInternationalisation({
        _id: this.details?._id,
        lang: this.language.value,
        json: jsonObject
      }).subscribe({
        next: (res: any) => {
          this.onResponse(res)
        }, error: (err: any) => {
          this.HotToastService.error(err?.error?.message)
        }
      })
    } else {
      this.InternationalisationService.createInternationalisation({
        lang: this.language.value,
        json: jsonObject
      }).subscribe({
        next: (res: any) => {
          this.onResponse(res)
        }, error: (err: any) => {
          this.HotToastService.error(err?.error?.message)
        }
      })
    }
  }

  onResponse(res: any) {
    if (res?.errorCode == 0) {
      this.modalRef?.hide()
      this.getDetails()
      this.HotToastService.success(res?.message)
    } else {
      this.HotToastService.error(res?.message)
    }
  }

  decline() {
    this.modalRef?.hide()
  }

  getDetails() {
    this.langKeys = []
    this.rawLangKeys()
    this.InternationalisationService.getInternationalisation(this.language.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result
          if (res?.result?.json) {
            for (let key of Object.keys(res?.result?.json)) {
              this.updateOrAddKey(this.langKeys, key, res?.result?.json[key])
            }
          } else {
            this.rawLangKeys()
          }
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  updateOrAddKey(langKeys: Array<any>, langKey: string, newValue: string) {
    const existingEntry = langKeys.find(item => item.key === langKey);
    if (existingEntry) {
      existingEntry.value = newValue;
    } else {
      langKeys.push({ key: langKey, value: '' });
    }
  }

  rawLangKeys() {
    for (let langKey of Object.keys(internationalisationKeys)) {
      this.langKeys.push({ key: langKey, value: '' })
    }
  }

}
