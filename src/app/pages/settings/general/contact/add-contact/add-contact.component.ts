import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { ContactsService } from 'src/app/includes/services/contacts.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  contactsForm: FormGroup
  isSubmitted = false;
  uniqueEmail: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
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
      lat: [''],
      lng: [''],
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateContact();
    } else {
      this.addContact();
    }
  }

  addContact() {
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

    this.contactsService.addContact(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Contact added successfully');
        this.router.navigate([this.appRoute.contacts.CONTACTS_LIST]);
      }
    })
  }

  updateContact() {
  }
}
