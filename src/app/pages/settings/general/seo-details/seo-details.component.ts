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
  data: any = {}
  form: FormGroup
  isValid: boolean = true;

  constructor(
    private SeoService: SeoService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  get fc() { return this.form.controls }

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
        this.data = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  updateSeoDetails() {
    if (!this.form.valid) {
      this.isValid = false
      return
    }


  }

  addSeoDetails() {
    if (!this.form.valid) {
      this.isValid = false
      return
    }

    this.SeoService.addSeoDetails(this.form.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
        this.form.reset()
      } else this.ToastrService.error(res?.message)
    }
    )
  }
}
