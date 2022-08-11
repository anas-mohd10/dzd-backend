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
  contactsForm: FormGroup
  isSubmitted = false;
  uniqueEmail: boolean;
  slug: any
  contactData: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.queryParams.slug || ''
    this.getContactBySlug()
  }

  initForm() {
    this.contactsForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      isActive: ['true', Validators.required],
      firstline: ['', Validators.required],
      secondline: [''],
      area: [''],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      state: ['', Validators.required],
    });
  }

  get ctf() {
    return this.contactsForm.controls;
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

  getContactBySlug() {
    this.contactsService.getContactBySlug(this.slug).subscribe((res: any) => {
      this.contactData = res?.result[0]
      this.contactsForm.get("name")?.setValue(this.contactData.name)
      this.contactsForm.get("email")?.setValue(this.contactData.email)
      this.contactsForm.get("mobile")?.setValue(this.contactData.mobile)
      this.contactsForm.get("firstline")?.setValue(this.contactData.address[0].firstline)
      this.contactsForm.get("secondline")?.setValue(this.contactData.address[0].secondline)
      this.contactsForm.get("area")?.setValue(this.contactData.address[0].area)
      this.contactsForm.get("city")?.setValue(this.contactData.address[0].city)
      this.contactsForm.get("pincode")?.setValue(this.contactData.address[0].pincode)
      this.contactsForm.get("state")?.setValue(this.contactData.address[0].state)
      this.contactsForm.get("lat")?.setValue(this.contactData.address[0].lat)
      this.contactsForm.get("lng")?.setValue(this.contactData.address[0].lng)
      this.contactsForm.get("isActive")?.setValue(this.contactData.isActive)
    })
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
    if (!this.contactsForm.valid) {
      this.toastr.error('Something wrong occured');
      return;
    }
    let data = {
      name: this.contactsForm.get("name")?.value,
      email: this.contactsForm.get("email")?.value,
      mobile: this.contactsForm.get("mobile")?.value,
      address: [{
        firstline: this.contactsForm.get("firstline")?.value,
        secondline: this.contactsForm.get("secondline")?.value,
        area: this.contactsForm.get("area")?.value,
        city: this.contactsForm.get("city")?.value,
        pincode: this.contactsForm.get("pincode")?.value,
        state: this.contactsForm.get("state")?.value,
        lat: this.contactsForm.get("lat")?.value,
        lng: this.contactsForm.get("lng")?.value,
      }],
      isActive: this.contactsForm.get("isActive")?.value,
    }
    this.contactsService.updateContact(this.slug, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Contact updated successfully');
        this.router.navigate([this.appRoute.contacts.CONTACTS_LIST]);
      }
    })
  }

}
