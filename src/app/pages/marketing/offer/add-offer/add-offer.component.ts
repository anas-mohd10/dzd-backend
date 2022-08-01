import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit {
  offerForm: FormGroup;
  appRoute = appRoutes;
  editMode = false;
  task = PageTasks.ADD;
  fileData: File;
  isSubmitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private offerService: OfferService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.managePage();
  }

  initForm() {
    this.offerForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [''],
      description: ['', Validators.required],
      fromDate: ['', Validators.required],
      lastDate: ['', Validators.required],
      isFeatured: ['false', Validators.required],
      isActive: ['true', Validators.required],
    });
  }

  get of() {
    return this.offerForm.controls;
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  handleInputChange(fileInput: any) {
    const file = fileInput.dataTransfer
      ? fileInput.dataTransfer.files[0]
      : fileInput.target.files[0];
    this.fileData = <File>fileInput.target.files[0];
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  addBrand() {
    if (!this.offerForm.valid) {
      console.error("Validation error")
      return;
    }
    const formData = new FormData();

    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }
    formData.append('name', this.offerForm.value?.name);
    formData.append('description', this.offerForm.value?.description);
    if (this.offerForm.value?.fromDate) {
      formData.append('fromDate', new Date(this.offerForm.value?.fromDate).toDateString());
    }

    if (this.offerForm.value?.lastDate) {
      formData.append('lastDate', new Date(this.offerForm.value?.lastDate).toDateString());
    }
    formData.append('isActive', this.offerForm.value?.isActive);
    formData.append('isFeatured', this.offerForm.value?.isFeatured);
    this.offerService.addOffer(formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Offer Added Successfully');
        this.router.navigate([this.appRoute.offer.OFFER_LIST]);
      }
    });
  }

  updateBrand() { }
}
