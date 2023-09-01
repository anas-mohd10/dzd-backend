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
  form: FormGroup
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

  addContact() {
    if (!this.form.valid) {
      return;
    }

    let payload = {
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
    }

    this.contactsService.addContact(payload).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.contacts.CONTACTS_LIST]);
      }
    })
  }

  updateContact() {
  }
}
