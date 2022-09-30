import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { NotificationsService } from 'src/app/includes/services/notifications.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-notifications',
  templateUrl: './add-notifications.component.html',
  styleUrls: ['./add-notifications.component.scss']
})
export class AddNotificationsComponent implements OnInit {

  notificationForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  filedata: File;
  isSubmitted: boolean;
  appRoute = appRoutes;
  customersdata: any = []
  customers: any = []
  getCustomer: Boolean = false
  invalidDate: Boolean = false
  invalidTime: Boolean = false
  isScheduled: Boolean = false

  croppedImage: string | null | undefined;
  loadImage: boolean;
  filename: string;
  imageChangedEvent: any;

  constructor(
    private notificationsService: NotificationsService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getCustomers()
  }

  //Active customers
  getCustomers() {
    this.customersService.getActiveCustomers().subscribe((res: any) => {
      for (let cust of res?.result) {
        this.customersdata.push({
          name: cust.firstname,
          id: cust._id,
          key: this.customersdata.length
        })
      }
    })
  }

  handleInputChange(event: any) {
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  removeImage() {
    this.croppedImage = ''
    this.loadImage = false
  }

  selectcustomer(event: any) {
    let val = event.value
    if (val == "false") {
      this.getCustomer = true
    } else {
      this.getCustomer = false
      this.customers = []
      this.notificationForm.get("customer")?.setValue('')
    }
  }

  customerInput(event: any) {
    for (let cust of this.customersdata) {
      if (cust.key == event.value) {
        let check = this.customers.some((_data: any) => _data.key == event.value)
        if (check == false) {
          this.customers.push({
            key: event.value,
            name: cust.name,
            id: cust.id
          })
          this.notificationForm.get("customer")?.setValue('')
        } else {
          this.toastr.info("Customer already added")
          this.notificationForm.get("customer")?.setValue('')
        }
      }
    }
  }

  removeCustomer(value: any) {
    this.customers = this.customers.filter((_data: any) => _data.key != value)
  }

  checkType(event: any) {
    let type = event.value
    if (type == "SCHEDULED") {
      this.isScheduled = true
    } else {
      this.isScheduled = false
    }
  }

  checkScheduleDate(event: any) {
  }

  checkScheduleTime(event: any) {
  }

  initForm() {
    this.notificationForm = this.formBuilder.group({
      title: ['', Validators.required],
      channel: ['', Validators.required],
      type: ['', Validators.required],
      content: ['', Validators.required],
      scheduledDate: [''],
      scheduledTime: [''],
      file: [''],
      customer: [''],
      isAllCustomer: ['', Validators.required],
      isActive: ['true', Validators.required],
    });
  }

  get nf() {
    return this.notificationForm.controls;
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
      this.updateNotification();
    } else {
      this.addNotification();
    }
  }

  addNotification() {
    if (!this.notificationForm.valid) {
      this.toastr.error("Validation error")
      return;
    }

    const data = {
      title: this.notificationForm.get('title')?.value,
      channel: this.notificationForm.get('channel')?.value,
      type: this.notificationForm.get('type')?.value,
      content: this.notificationForm.get('content')?.value,
      scheduledDate: this.notificationForm.get('scheduledDate')?.value,
      scheduledTime: this.notificationForm.get('scheduledTime')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      customer: this.customers,
      isAllCustomer: this.notificationForm.get('isAllCustomer')?.value,
      isActive: this.notificationForm.get('isActive')?.value,
    }

    this.notificationsService.addNotification(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Notifications added successfully');
        this.router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
      }
    })
  }

  updateNotification() {
  }

}
