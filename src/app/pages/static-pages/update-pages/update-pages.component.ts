import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { StaticPageService } from 'src/app/includes/services/static-page.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-update-pages',
  templateUrl: './update-pages.component.html',
  styleUrls: ['./update-pages.component.scss']
})
export class UpdatePagesComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  details: any;
  staticPageId: any;
  modalRef?: BsModalRef;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'manrope', name: 'Manrope' },
      { class: 'sen', name: 'Sen' },
      { class: 'poppins', name: 'Poppins' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
      { class: 'roboto', name: 'Roboto' },
      { class: 'sora', name: 'Sora' }
    ]
  };

  constructor(
    private Router: Router,
    private StaticPageService: StaticPageService,
    private HotToastService: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  get formControls(){
    return this.form.controls
  }


  ngOnInit(): void {
    this.staticPageId = this.ActivatedRoute.snapshot.queryParams.id || '';

    this.StaticPageService.details(this.staticPageId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result;
          this.form.patchValue(this.details);
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      slug: new FormControl(''),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl('')
    })
  }

  confirm() {
    this.StaticPageService.delete(this.staticPageId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.modalRef?.hide();
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

  decline() {
    this.modalRef?.hide();
  }

  onDelete(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.StaticPageService.update({
      _id: this.details._id,
      slug: this.details.slug,
      ...this.form.value
    }).subscribe({
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
