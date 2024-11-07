import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { NotificationsService } from 'src/app/includes/services/notifications.service';

@Component({
  selector: 'app-update-notifications',
  templateUrl: './update-notifications.component.html',
  styleUrls: ['./update-notifications.component.scss'],
})
export class UpdateNotificationsComponent implements OnInit {
  form: FormGroup;
  isSubmitted: boolean;
  appRoute = appRoutes;
  customersData: Array<any> = [];
  customers: any;
  startDate: string = new Date().toISOString().split('T')[0];
  date = new Date();
  formattedDate: number = this.date.setDate(this.date.getDate() + 2);
  scheduleDate: string = this.date.toISOString().split('T')[0];
  thumbnail: string = '';
  notificationId: string = '';
  notificationDetails: any;

  constructor(
    private NotificationsService: NotificationsService,
    private CustomersService: CustomersService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notificationId = this.ActivatedRoute.snapshot.queryParams.id || '';

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      channel: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      type: new FormControl('instant'),
      scheduledDate: new FormControl(''),
      scheduledTime: new FormControl('10:00'),
      redirection: new FormControl(''),
      thumbnail: new FormControl(null),
      isStoreLevel: new FormControl('true'),
      isActive: new FormControl('true'),
    });

    this.form.get('scheduledDate')?.setValue(this.scheduleDate); // set default schedule date

    this.CustomersService.getActiveCustomers().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.customersData = res?.result;
          for (let customer of this.customersData)
            customer.title =
              (customer?.name ? customer?.name : '-- Incomplete Profile --') +
              ' ( ' +
              customer?.mobile +
              ' )';
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => {},
    });

    this.NotificationsService.getNotificationDetails(
      this.notificationId
    ).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.notificationDetails = res?.result;
          this.form.patchValue(res?.result);
          this.customers = res?.result?.customers;
          if (this.thumbnail) this.thumbnail = res?.result?.thumbnail?.path;
          if (res?.result?.scheduledDate)
            this.form
              .get('scheduledDate')
              ?.setValue(res?.result?.scheduledDate.split('T')[0]);
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => {},
    });
  }

  compareFn(item: any, selected: any) {
    return item?._id === selected?._id;
  }

  handleThumbnail(event: any) {
    this.form.get('thumbnail')?.setValue(event?._id);
    this.thumbnail = event?.path;
  }

  removeThumbnail() {
    this.form.get('thumbnail')?.setValue(null);
    this.thumbnail = '';
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.NotificationsService.updateNotification({
      ...this.form.value,
      scheduled: {
        date: this.form.get('scheduledDate')?.value,
        time: this.form.get('scheduledTime')?.value,
      },
      _id: this.notificationId,
      customers: this.customers,
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
        } else if (res.errorCode == 0) {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {},
    });
  }
}
