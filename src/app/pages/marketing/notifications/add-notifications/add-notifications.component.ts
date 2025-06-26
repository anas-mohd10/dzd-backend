import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-add-notifications',
  templateUrl: './add-notifications.component.html',
  styleUrls: ['./add-notifications.component.scss'],
})
export class AddNotificationsComponent implements OnInit {
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

  constructor(
    private NotificationsService: NotificationsService,
    private CustomersService: CustomersService,
    private Router: Router,
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

  // Utility method to convert datetime-local format to ISO string for backend
  private formatDateForBackend(dateTimeLocal: string): string {
    if (!dateTimeLocal) return '';
    // datetime-local format is already in local time, so we can create a Date object directly
    const date = new Date(dateTimeLocal);
    return date.toISOString();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      scheduledAt: new FormControl('', Validators.required),
      isStoreLevel: new FormControl(true),
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
    };

    this.NotificationsService.addNotification(formData).subscribe({
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
