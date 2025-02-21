import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { NotificationsService } from 'src/app/includes/services/notifications.service';
@Component({
  selector: 'app-add-notifications',
  templateUrl: './add-notifications.component.html',
  styleUrls: ['./add-notifications.component.scss'],
})
export class AddNotificationsComponent implements OnInit {
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

  constructor(
    private NotificationsService: NotificationsService,
    private CustomersService: CustomersService,
    private Router: Router,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      channel: new FormControl('', Validators.required),
      type: new FormControl('instant'),
      content: new FormControl('', Validators.required),
      scheduledDate: new FormControl(''),
      scheduledTime: new FormControl('10:00'),
      redirection: new FormControl(''),
      thumbnail: new FormControl(null),
      isStoreLevel: new FormControl('true', Validators.required),
      isActive: new FormControl('true', Validators.required),
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

    this.NotificationsService.addNotification({
      ...this.form.value,
      // scheduled: {
      //   date: this.form.get('scheduledDate')?.value,
      //   time: this.form.get('scheduledTime')?.value,
      // },

      scheduled: this.form.get('scheduledDate')?.value && this.form.get('scheduledTime')?.value ? 
        new Date(`${this.form.get('scheduledDate')?.value}T${this.form.get('scheduledTime')?.value}`).toISOString() : null,
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
