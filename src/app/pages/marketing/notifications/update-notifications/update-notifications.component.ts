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

  form: FormGroup;
  task = PageTasks.UPDATE;
  editMode = false;
  filedata: File;
  isSubmitted: boolean;
  appRoute = appRoutes;

  getCustomer: Boolean = false
  invalidDate: Boolean = false
  slug: any;
  date: any
  type: any
  isScheduled: boolean;
  uploadedimg: any;
  img: any

  startDate: string = new Date().toISOString().split('T')[0];
  croppedImage: string | null | undefined;
  loadImage: boolean;
  filename: string;
  imageChangedEvent: any;
  base: string = environment.base;
  customersData: Array<any> = []
  selectCustomers: boolean = false
  notification: string = ''
  isTypeDisabled: boolean = false
  customers: Array<any> = []
  notificationDetails: any = {}

  constructor(
    private NotificationsService: NotificationsService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.notification = this.route.snapshot.queryParams.notification || ''

    this.customersService.getActiveCustomers().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.customersData = res?.result
        for (let customer of this.customersData) customer.title = (customer?.name ? customer?.name : '-- Incomplete Profile --') + " ( " + customer?.mobile + " )"
        this.cdr.markForCheck()
      }
    })

    this.NotificationsService.getNotificationDetails(this.notification).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        for (let _key of Object.keys(res?.result)) {
          this.form.get(_key)?.setValue(res?.result[_key])
        }
        this.notificationDetails = res?.result
        for (let customer of res?.result?.customers) this.customers.push(customer?.id)
        res?.result?.type == 'scheduled' ? this.isScheduled = true : this.isScheduled = false
        !res?.result?.notifyAll ? this.selectCustomers = true : this.selectCustomers = false
        res?.result?.image ? this.img = res?.result?.image : this.img = null
        this.form.get('scheduledDate')?.setValue(res?.result?.scheduled?.date.split('T')[0])
        this.form.get('scheduledTime')?.setValue(res?.result?.scheduled?.time)
        this.cdr.markForCheck()
      }
    })
  }

  notifyCustomers() {
    if (this.form.get('notifyAll')?.value == 'false') {
      this.selectCustomers = true
    } else {
      this.selectCustomers = false
    }
  }

  getChannel() {
    if (this.form.get('channel')?.value == 'app') {
      this.isTypeDisabled = true
    } else {
      this.isTypeDisabled = false
    }
  }


  selectcustomer(event: any) {
    let val = event.value
    if (val == "false") {
      this.getCustomer = true
    } else {
      this.getCustomer = false
      this.customers = []
    }
  }

  compareFn(item: any, selected: any) {
    return item._id === selected._id;
  }

  checkType(event: any) {
    let type = event.value
    if (type == "scheduled") {
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
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      channel: ['', Validators.required],
      type: ['instant'],
      content: ['', Validators.required],
      scheduledDate: [''],
      scheduledTime: [''],
      file: [''],
      customer: [''],
      redirection: [''],
      selectCustomer: [''],
      notifyAll: ['', Validators.required],
      isActive: ['true', Validators.required],
    });
  }

  get nf() {
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
  }

  cropperReady() {
  }

  loadImageFailed() {
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
    if (!this.form.valid) {
      this.toastr.error("Validation error")
      return;
    }

    let data: any = {
      title: this.form.get('title')?.value,
      channel: this.form.get('channel')?.value,
      type: this.form.get('type')?.value,
      content: this.form.get('content')?.value,
      scheduled: {
        date: this.form.get('scheduledDate')?.value,
        time: this.form.get('scheduledTime')?.value,
      },
      filestring: this.croppedImage,
      filename: this.filename,
      customers: this.customers,
      redirect: this.form.get('redirection')?.value,
      notifyAll: this.form.get('notifyAll')?.value,
      isActive: this.form.get('isActive')?.value,
      refid: this.notificationDetails?.refid
    }

    this.img ? data['image'] = this.img : data['image'] = null
    this.NotificationsService.updateNotification(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.result);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.result);
        this.router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
      }
    })
  }

}
