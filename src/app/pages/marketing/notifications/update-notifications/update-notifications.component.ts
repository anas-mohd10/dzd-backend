import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { NotificationsService } from 'src/app/includes/services/notifications.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-update-notifications',
  templateUrl: './update-notifications.component.html',
  styleUrls: ['./update-notifications.component.scss']
})
export class UpdateNotificationsComponent implements OnInit {

  notificationForm: FormGroup;
  task = PageTasks.UPDATE;
  editMode = false;
  filedata: File;
  isSubmitted: boolean;
  appRoute = appRoutes;
  customersdata: any = []
  customers: any = []
  getCustomer: Boolean = false
  invalidDate: Boolean = false
  slug: any;
  date: any
  type: any
  isScheduled: boolean;
  uploadedimg: any;
  img: any

  croppedImage: string | null | undefined;
  loadImage: boolean;
  filename: string;
  imageChangedEvent: any;
  base: string;

  constructor(
    private notificationsService: NotificationsService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.managePage()
    this.getCustomers()
    this.slug = this.route.snapshot.queryParams.notification || ''
    this.getNotification()
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

  getNotification() {
    this.notificationsService.getNotificationBySlug(this.slug).subscribe((res: any) => {
      this.notificationForm.get("title")?.setValue(res?.result[0].title)
      this.notificationForm.get("content")?.setValue(res?.result[0].content)
      this.notificationForm.get("channel")?.setValue(res?.result[0].channel)
      this.notificationForm.get("type")?.setValue(res?.result[0].type)
      this.notificationForm.get("isActive")?.setValue(res?.result[0].isActive)
      this.notificationForm.get("status")?.setValue(res?.result[0].status)
      this.notificationForm.get("isAllCustomer")?.setValue(JSON.stringify(res?.result[0].isAllCustomer))
      this.uploadedimg = res?.result[0].file
      this.img = this.base + "/" + res?.result[0].file
      let type = res?.result[0].type
      if (type == "Scheduled") {
        this.isScheduled = true
      }
      if (res?.result[0].isAllCustomer == false) {
        this.getCustomer = true
        for (let data of res?.result[0].customer) {
          this.customers.push({
            key: data.key,
            name: data.name,
            id: data.id,
          })
        }
        this.notificationForm.get("scheduledDate")?.setValue(JSON.stringify(new Date(res?.result[0].scheduledDate).toLocaleDateString()))
        this.notificationForm.get("scheduledTime")?.setValue(res?.result[0].scheduledTime)
        this.cdr.markForCheck()
      }
    })
  }

  compareFn(item: any, selected: any) {
    return item._id === selected._id;
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
            key: Number(event.value),
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
    if (type == "Scheduled") {
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
      status: ['', Validators.required],
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateNotification();
    } else {
      this.addNotification();
    }
  }

  addNotification() {
  }

  updateNotification() {
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
      file: '',
      status: this.notificationForm.get('status')?.value
    }
    if (this.uploadedimg) {
      data.file = this.uploadedimg
    }
    this.notificationsService.updateNotification(this.slug, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Notifications updated successfully');
        this.router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
      }
    })
  }
}
