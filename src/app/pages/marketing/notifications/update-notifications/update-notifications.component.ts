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
  isSubmitted: boolean = false;
  isLoading: boolean = true;
  appRoute = appRoutes;
  customersData: Array<any> = [];
  customers: Array<string> = [];
  startDate: string = new Date().toISOString().split('T')[0];
  date = new Date();
  formattedDate: number = this.date.setDate(this.date.getDate() + 2);
  scheduleDate: string = this.date.toISOString().split('T')[0];
  thumbnail: string = '';
  notificationId: string = '';
  notificationDetails: any;

  constructor(
    private notificationsService: NotificationsService,
    private customersService: CustomersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private hotToastService: HotToastService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize form
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      channel: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      type: new FormControl('instant'),
      scheduledDate: new FormControl(this.scheduleDate),
      scheduledTime: new FormControl('10:00'),
      redirection: new FormControl(''),
      thumbnail: new FormControl(null),
      isStoreLevel: new FormControl('true'),
      isActive: new FormControl('true'),
    });
  }

  ngOnInit(): void {
    this.notificationId = this.activatedRoute.snapshot.queryParams.id || '';
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    
    try {
      // Use Promise.all to fetch data in parallel
      const [customersData, notificationData] = await Promise.all([
        this.fetchCustomers(),
        this.fetchNotificationDetails()
      ]);
      
      // Process customers data if successful
      if (customersData && customersData.errorCode === 0) {
        this.customersData = customersData.result.map((customer: any) => ({
          ...customer,
          title: (customer?.name ? customer?.name : '-- Incomplete Profile --') + 
                 ' ( ' + customer?.mobile + ' )'
        }));
      }
      
      // Process notification details if successful
      if (notificationData && notificationData.errorCode === 0) {
        this.notificationDetails = notificationData.result;
        this.populateForm(notificationData.result);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.hotToastService.error('Failed to load data. Please try again.');
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }
  
  fetchCustomers(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.customersService) {
        resolve({ errorCode: 1, result: [] });
        return;
      }
      
      this.customersService.getActiveCustomers().subscribe({
        next: (res: any) => resolve(res),
        error: (err: any) => {
          console.error('Error fetching customers:', err);
          reject(err);
        }
      });
    });
  }
  
  fetchNotificationDetails(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.notificationId) {
        resolve({ errorCode: 0, result: null });
        return;
      }
      
      this.notificationsService.getNotificationDetails(this.notificationId).subscribe({
        next: (res: any) => resolve(res),
        error: (err: any) => {
          console.error('Error fetching notification details:', err);
          reject(err);
        }
      });
    });
  }

  populateForm(data: any) {
    if (!data) return;

    // Update form values
    this.form.patchValue({
      title: data.title,
      channel: data.channel,
      content: data.content,
      type: data.type || 'instant',
      redirection: data.redirection,
      thumbnail: data.thumbnail?._id,
      isStoreLevel: data.isStoreLevel.toString(),
      isActive: data.isActive.toString(),
    });
    
    // Handle scheduled date and time
    if (data.scheduledDate) {
      const scheduledDateTime = new Date(data.scheduledDate);
      this.form.get('scheduledDate')?.setValue(scheduledDateTime.toISOString().split('T')[0]);
      
      // Format time as HH:MM
      const hours = scheduledDateTime.getHours().toString().padStart(2, '0');
      const minutes = scheduledDateTime.getMinutes().toString().padStart(2, '0');
      this.form.get('scheduledTime')?.setValue(`${hours}:${minutes}`);
    }
    
    // Set thumbnail if available
    if (data.thumbnail?.path) {
      this.thumbnail = data.thumbnail.path;
    }
    
    // Process customers - ensure we're working with IDs
    if (data.customers && Array.isArray(data.customers)) {
      // If customers are objects with _id property
      if (data.customers.length > 0 && typeof data.customers[0] === 'object') {
        this.customers = data.customers.map((customer: any) => customer._id);
      } else {
        // If customers are already IDs
        this.customers = data.customers;
      }
    }
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

    let scheduledDateTime = null;
    if (this.form.get('type')?.value === 'scheduled' && 
        this.form.get('scheduledDate')?.value && 
        this.form.get('scheduledTime')?.value) {
      scheduledDateTime = new Date(
        `${this.form.get('scheduledDate')?.value}T${this.form.get('scheduledTime')?.value}`
      ).toISOString();
    }

    this.notificationsService.updateNotification({
      ...this.form.value,
      scheduled: scheduledDateTime,
      _id: this.notificationId,
      customers: this.customers,
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.hotToastService.success(res?.message);
          this.router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
        } else {
          this.hotToastService.error(res?.message || 'Failed to update notification');
        }
      },
      error: (err: any) => {
        this.hotToastService.error('An error occurred while updating the notification');
        console.error('Error updating notification:', err);
      },
    });
  }
}