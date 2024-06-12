import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ContentService } from 'src/app/includes/services/content.service';

@Component({
  selector: 'app-contact-cms',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  thumbnailPreview: string;
  contactCmsDetails: any;
  isSubmitted: boolean = false;

  constructor(
    private ContentService: ContentService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  get formControls() {
    return this.form.controls
  }

  getCmsDetails() {
    this.ContentService.getContactCmsDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.contactCmsDetails = res?.result
          this.form.patchValue(this.contactCmsDetails)
          this.form.get('thumbnail')?.setValue(res?.result?.thumbnail?._id)
          this.thumbnailPreview = res?.result?.thumbnail?.path
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  ngOnInit(): void {
    this.getCmsDetails()
    this.form = new FormGroup({
      address: new FormControl(''),
      mobile: new FormControl('', [Validators.pattern("^[+0-9]{6,15}$")]),
      email: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      thumbnail: new FormControl(null)
    })
  }

  getThumbnail(event: any) {
    this.form.patchValue({ thumbnail: event._id })
  }

  cancelChanges() {
    this.form.reset()
    this.getCmsDetails()
  }

  saveChanges() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return
    }

    this.ContentService.manageContactCms(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message || 'Contact cms details updated successfully')
          this.form.reset()
          this.getCmsDetails()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message || 'Something went wrong')
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message || 'Something went wrong')
      }
    })
  }
}
