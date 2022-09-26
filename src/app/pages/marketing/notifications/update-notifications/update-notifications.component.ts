import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { NotificationsService } from 'src/app/includes/services/notifications.service';

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
  image: any;

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
    this.slug = this.route.snapshot.queryParams.slug || ''
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
      this.image = res?.result[0].file
      let type = res?.result[0].type
      if (type == "SCHEDULED") {
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
      } else {

      }
    })
  }

  handleInputChange(event: any) {
    this.filedata = <File>event.target.files[0];
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
    const formdata = new FormData()
    if (this.filedata != null && this.filedata != undefined) {
      formdata.append('file', this.filedata);
    } else {
      formdata.append("file", this.image)
    }
    for (const data of Object.keys(this.notificationForm.value)) {
      if (data != 'customer') {
        formdata.append(data, this.notificationForm.value[data]);
      }
    }
    formdata.append("customer", JSON.stringify(this.customers))
    this.notificationsService.updateNotification(this.slug, formdata).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Notifications added successfully');
        this.router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
      }
    })
  }
}
