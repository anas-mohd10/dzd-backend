import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { debounceTime } from 'rxjs/operators';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { NotificationsService } from 'src/app/includes/services/notifications.service';

interface CustomerDoc {
  name: string;
  email: string;
  countryCode: string;
  _id: string;
  mobile: string;
}

@Component({
  selector: 'app-update-notifications',
  templateUrl: './update-notifications.component.html',
  styleUrls: ['./update-notifications.component.scss'],
})
export class UpdateNotificationsComponent implements OnInit {
  form: FormGroup;
  isSubmitted: boolean;
  isLoading: boolean = false;
  appRoute = appRoutes;
  modalRef: BsModalRef;
  page: number = 1;
  limit: number = 10;
  totalResults: number = 0;
  totalPages: number = 1;
  customerDocs: Array<CustomerDoc> = [];
  customers: Array<CustomerDoc> = [];
  searchKeyword: FormControl = new FormControl('');
  notificationId: string;
  isFutureEvent: boolean = false;

  constructor(
    private NotificationsService: NotificationsService,
    private CustomersService: CustomersService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) {
    this.searchKeyword.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.getCustomers()
    })
  }

  //Open modal
  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg', ignoreBackdropClick: true });
  }

  //Pagination
  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getCustomers()
  }

  //Get customers
  getCustomers() {
    this.CustomersService.searchCustomers({
      keyword: this.searchKeyword.value,
      page: this.page,
      isActive: true,
      limit: this.limit
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.customerDocs = res?.result?.data
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.ChangeDetectorRef.markForCheck()
        } else { }
      },
      error: (err: any) => { },
    });
  }

  onSelect(customer: CustomerDoc) {
    if (!this.isCustomerSelected(customer)) {
      this.customers.push(customer);
    } else {
      this.customers = this.customers.filter(c => c._id != customer._id);
    }
  }

  isCustomerSelected(customer: CustomerDoc) {
    return this.customers.find(c => c._id == customer._id);
  }

  // Utility method to format date for datetime-local input
  private formatDateForDateTimeLocal(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);

    // Get local date and time components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Return in datetime-local format (YYYY-MM-DDTHH:mm)
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Utility method to convert datetime-local format to ISO string for backend
  private formatDateForBackend(dateTimeLocal: string): string {
    if (!dateTimeLocal) return '';
    // datetime-local format is already in local time, so we can create a Date object directly
    const date = new Date(dateTimeLocal);
    return date.toISOString();
  }

  ngOnInit(): void {
    this.notificationId = this.ActivatedRoute.snapshot.queryParams['notificationId'];

    if (!this.notificationId) {
      this.Router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
    }

    this.NotificationsService.getNotificationDetails(this.notificationId).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0 && res.result && Object.keys(res.result).length > 0) {
          // Format the scheduledAt date for datetime-local input
          const result = { ...res.result };
          if (result.scheduledAt) {
            result.scheduledAt = this.formatDateForDateTimeLocal(result.scheduledAt);
          }

          if (result.scheduledAt) {
            const scheduledDate = new Date(result.scheduledAt);
            const currentDate = new Date();
            this.isFutureEvent = scheduledDate > currentDate;
          }

          this.form.patchValue(result);
          this.customers = res.result.customers;
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      }
    })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      scheduledAt: new FormControl('', Validators.required),
      isStoreLevel: new FormControl('true'),
      isProfileLevel: new FormControl(false),
      redirection: new FormControl(''),
      thumbnail: new FormControl(''),
    });
  }

  handleThumbnail(event: any) {
    this.form.get('thumbnail')?.setValue(event?.path);
  }

  removeThumbnail() {
    this.form.get('thumbnail')?.setValue('');
  }

  onProfileLevelToggled(event: { switchId: string, toggleState: boolean }) {
    this.form.get('isProfileLevel')?.setValue(event.toggleState);
  }

  get formControls() {
    return this.form.controls;
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.NotificationsService.deleteNotification(this.notificationId).subscribe({
        next: (res: any) => {
          if (res.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.Router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
          } else {
            this.HotToastService.error(res?.message);
          }
        }, error: (err: any) => {
          this.HotToastService.error(err?.error?.message);
        }
      })
    } else {
      this.HotToastService.error('Action cancelled');
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    if (this.isLoading) {
      return; // Prevent multiple submissions
    }

    this.isLoading = true;

    if (this.form.get('isStoreLevel')?.value == 'false' && this.customers.length == 0) {
      this.HotToastService.error('Please select at least one customer');
      this.isLoading = false;
      return;
    }

    // Prepare form data with proper date formatting
    const formData = {
      ...this.form.value,
      scheduledAt: this.formatDateForBackend(this.form.value.scheduledAt),
      customers: this.customers,
      _id: this.notificationId
    };

    this.NotificationsService.updateNotification(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.notification.NOTIFICATION_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.HotToastService.error(err?.error?.message);
      },
    });
  }
}
