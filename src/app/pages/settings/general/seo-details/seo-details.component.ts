import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { SeoService } from 'src/app/includes/services/seo.service';

@Component({
  selector: 'app-seo-details',
  templateUrl: './seo-details.component.html',
  styleUrls: ['./seo-details.component.scss']
})
export class SeoDetailsComponent implements OnInit {
  appRoute = appRoutes
  seoDetails: any = []
  form: FormGroup
  isValid: boolean = true;

  constructor(
    private SeoService: SeoService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  get fc() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      page: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      keywords: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    })

    this.SeoService.getSeoDetails().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.seoDetails = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  getSeoDetails(seo: any) {
    this.SeoService.getSeoDetailsById(seo).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        for (let _key of Object.keys(res?.result)) this.form.get(_key)?.setValue(res?.result[_key])
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  closeModal() {
    this.form.reset()
    this.isValid = true
  }

  manageDetails() {
    if (!this.form.valid) {
      this.isValid = false
      return
    }

    this.SeoService.addSeoDetails(this.form.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
        document.location.reload()
      } else {
        this.ToastrService.error(res?.message)
      }
    }
    )
  }
}