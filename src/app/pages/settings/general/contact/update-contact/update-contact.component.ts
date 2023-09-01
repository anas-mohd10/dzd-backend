import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { ContactsService } from 'src/app/includes/services/contacts.service';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.scss']
})
export class UpdateContactComponent implements OnInit {
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  form: FormGroup
  isSubmitted = false;
  uniqueEmail: boolean;
  contact: any

  contactDetails: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.contact = this.route.snapshot.queryParams.contact || ''
    this.contactsService.getContactDetails(this.contact).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.contactDetails = res?.result
        for (let _key of Object.keys(res?.result)) this.form.get(_key)?.setValue(res?.result[_key])
        this.form.get('lat')?.setValue(res?.result?.coords?.lat)
        this.form.get('lng')?.setValue(res?.result?.coords?.lng)
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      countryCode: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      isActive: ['true'],
      isPrimary: ['false'],
      firstlane: [''],
      secondlane: [''],
      area: [''],
      city: [''],
      pincode: [''],
      lat: [''],
      lng: [''],
      state: [''],
    });
  }

  get ctf() {
    return this.form.controls;
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateContact();
    } else {
      this.addContact();
    }
  }

  addContact() { }

  updateContact() {
    if (!this.form.valid) {
      this.toastr.error('Something wrong occured');
      return;
    }

    let data = {
      name: this.form.get("name")?.value,
      email: this.form.get("email")?.value,
      countryCode: this.form.get("countryCode")?.value,
      mobile: this.form.get("mobile")?.value,
      address: {
        firstlane: this.form.get("firstlane")?.value,
        secondlane: this.form.get("secondlane")?.value,
        area: this.form.get("area")?.value,
        city: this.form.get("city")?.value,
        pincode: this.form.get("pincode")?.value,
        state: this.form.get("state")?.value,
        coords: {
          lat: this.form.get("lat")?.value,
          lng: this.form.get("lng")?.value,
        }
      },
      isPrimary: this.form.get("isPrimary")?.value,
      isActive: this.form.get("isActive")?.value,
      refid: this.contact
    }

    this.contactsService.updateContact(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.contacts.CONTACTS_LIST]);
      }
    })
  }

}
