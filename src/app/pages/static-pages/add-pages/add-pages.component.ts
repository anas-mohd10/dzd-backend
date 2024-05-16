import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { StaticPageService } from 'src/app/includes/services/static-page.service';

@Component({
  selector: 'app-add-pages',
  templateUrl: './add-pages.component.html',
  styleUrls: ['./add-pages.component.scss']
})
export class AddPagesComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;

  constructor(
    private Router: Router,
    private StaticPageService: StaticPageService,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      html: new FormControl('', Validators.required),
      styles: new FormControl(''),
      scripts: new FormControl(''),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl('')
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.StaticPageService.create(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([appRoutes.staticPages.list])
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    })
  }

}
