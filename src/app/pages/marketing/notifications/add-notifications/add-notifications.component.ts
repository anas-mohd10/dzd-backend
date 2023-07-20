import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  filedata: File;
  isSubmitted: boolean;
  appRoute = appRoutes;
  customersData: Array<any> = []
  customers: any
  selectCustomers: boolean = false
  invalidDate: Boolean = false
  invalidTime: Boolean = false
  isScheduled: Boolean = false
  croppedImage: string | null | undefined;
  loadImage: boolean;
  filename: string;
  imageChangedEvent: any;
  isTypeDisabled: boolean = false

  constructor(
    private notificationsService: NotificationsService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()

    this.customersService.getActiveCustomers().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.customersData = res?.result
        for (let customer of this.customersData) customer.title = (customer?.name ? customer?.name : '-- Incomplete Profile --') + " ( " + customer?.mobile + " )"
        this.cdr.markForCheck()
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

  checkType(event: any) {
    let type = event.value
    if (type == "scheduled") {
      this.isScheduled = true
    } else {
      this.isScheduled = false
    }
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateNotification();
    } else {
      this.addNotification();
    }
  }

  addNotification() {
    if (!this.form.valid) {
      this.toastr.error("Kindly fill required fields")
      return;
    }

    const data = {
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
    }

    this.notificationsService.addNotification(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
      }
    })
  }

  updateNotification() {

  }

}
