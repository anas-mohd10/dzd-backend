import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';

@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.scss'],
})
export class UpdateOfferComponent implements OnInit {
  offerForm: FormGroup;
  appRoute = appRoutes;
  task = PageTasks.UPDATE;
  editMode = false;
  fileData: File;
  isSubmitted: boolean;
  offer: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    this.offer = this.route.snapshot.queryParams.offer || '';
    this.initForm();
    this.managePage();
  }

  initForm() {
    this.offerForm = this.formBuilder.group({
      name: ['',],
      description: ['',],
      fromDate: ['',],
      lastDate: ['',],
      featured: ['',],
      status: ['',],
    });
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
    const file = fileInput.dataTransfer? fileInput.dataTransfer.files[0]: fileInput.target.files[0];
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

  addBrand() {}
  updateBrand() {
    console.log("Update offer")
    if (!this.offerForm.valid) {
      return;
    }
    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }
    for (const data of Object.keys(this.offerForm.value)) {
      if(this.offerForm.value[data] != '' || null){
        formData.append(data, this.offerForm.value[data])
      } 
    }

    this.offerService.updateOffer(this.offer, formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Brand Updated Successfully');
        this.router.navigate([this.appRoute.offer.OFFER_LIST]);
      }
    });
  }
}
