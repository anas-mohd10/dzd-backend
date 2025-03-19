
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
  customers: Array<string> = []; // Changed to Array<string> for storing customer IDs
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

    // First get all customers
    this.fetchCustomers();

    // Then get notification details and set the customers
    this.fetchNotificationDetails();
  }

  fetchCustomers() {
    this.CustomersService.getActiveCustomers().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.customersData = res?.result;
          for (let customer of this.customersData) {
            customer.title =
              (customer?.name ? customer?.name : '-- Incomplete Profile --') +
              ' ( ' +
              customer?.mobile +
              ' )';
          }
          // Fetch notification details after customers are loaded
          this.fetchNotificationDetails();
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => {
        console.error('Error fetching customers:', err);
      },
    });
  }

  fetchNotificationDetails() {
    if (!this.notificationId) return;
    
    this.NotificationsService.getNotificationDetails(
      this.notificationId
    ).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.notificationDetails = res?.result;
          
          // Update form values first
          this.form.patchValue({
            title: res?.result?.title,
            channel: res?.result?.channel,
            content: res?.result?.content,
            type: res?.result?.type || 'instant',
            redirection: res?.result?.redirection,
            thumbnail: res?.result?.thumbnail?._id,
            isStoreLevel: res?.result?.isStoreLevel.toString(),
            isActive: res?.result?.isActive.toString(),
          });
          
          // Handle scheduled date and time
          if (res?.result?.scheduledDate) {
            const scheduledDateTime = new Date(res?.result?.scheduledDate);
            this.form.get('scheduledDate')?.setValue(scheduledDateTime.toISOString().split('T')[0]);
            
            // Format time as HH:MM
            const hours = scheduledDateTime.getHours().toString().padStart(2, '0');
            const minutes = scheduledDateTime.getMinutes().toString().padStart(2, '0');
            this.form.get('scheduledTime')?.setValue(`${hours}:${minutes}`);
          }
          
          // Set thumbnail if available
          if (res?.result?.thumbnail?.path) {
            this.thumbnail = res?.result?.thumbnail?.path;
          }
          
          // Process customers - ensure we're working with IDs
          if (res?.result?.customers && Array.isArray(res?.result?.customers)) {
            // If customers are objects with _id property
            if (typeof res?.result?.customers[0] === 'object') {
              this.customers = res?.result?.customers.map((customer: any) => customer._id);
            } else {
              // If customers are already IDs
              this.customers = res?.result?.customers;
            }
          }
          
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => {
        console.error('Error fetching notification details:', err);
      },
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
      scheduled: this.form.get('scheduledDate')?.value && this.form.get('scheduledTime')?.value ? 
        new Date(`${this.form.get('scheduledDate')?.value}T${this.form.get('scheduledTime')?.value}`).toISOString() : null,
      _id: this.notificationId,
      customers: this.customers,
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
        } else {
          this.HotToastService.error(res?.message || 'Failed to update notification');
        }
      },
      error: (err: any) => {
        this.HotToastService.error('An error occurred while updating the notification');
        console.error('Error updating notification:', err);
      },
    });
  }
}