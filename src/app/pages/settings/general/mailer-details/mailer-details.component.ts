import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { CustomMailerService } from 'src/app/includes/services/custom-mailer.service';

@Component({
  selector: 'app-mailer-details',
  templateUrl: './mailer-details.component.html',
  styleUrls: ['./mailer-details.component.scss'],
})
export class MailerDetailsComponent implements OnInit {
  appRoute = appRoutes;
  isSubmitted: boolean = false;
  mailerType: string;
  mailers: Array<any> = [
    {
      title: 'Authentication',
      type: 'authentication',
      description: 'Email templates related to user authentication and account management',
      mailers: [
        { title: 'OTP Verification', type: 'send-otp' },
        { title: 'Reset Password', type: 'reset-password' },
        { title: 'Welcome Customer', type: 'welcome-customer' }
      ]
    },
    {
      title: 'Orders',
      type: 'orders',
      description: 'Email templates for order management and updates',
      mailers: [
        { title: 'Order Placed', type: 'order-placed' },
        { title: 'Order Accepted', type: 'order-accepted' },
        { title: 'Order Packed', type: 'order-packed' },
        { title: 'Order Shipped', type: 'order-shipped' },
        { title: 'Order Out for Delivery', type: 'order-out-for-delivery' },
        { title: 'Order Delivered', type: 'order-delivered' },
        { title: 'Order Cancelled', type: 'order-cancelled' },
        { title: 'Order failed', type: 'order-failed' },
        { title: 'Order Product Cancelled', type: 'order-product-cancelled' },
        { title: 'Admin Order Notification', type: 'admin-place-order-notification' }
      ]
    },
    {
      title: 'Newsletter',
      type: 'newsletters',
      description: 'Email templates for newsletter management',
      mailers: [
        { title: 'Newsletter Subscribed', type: 'newsletter-subscribed' },
        { title: 'Newsletter Unsubscribed', type: 'newsletter-unsubscribed' },
        { title: 'Newsletter Verification', type: 'newsletter-verification' },
        { title: 'Newsletter Notification', type: 'newsletter-notification' }
      ]
    },
    {
      title: 'Cart & Wishlist',
      type: 'cart-wishlist',
      description: 'Email templates for abandoned cart and wishlist reminders',
      mailers: [
        { title: 'Abandoned Cart', type: 'abandoned-cart' },
        { title: 'Abandoned Wishlist', type: 'abandoned-wishlist' }
      ]
    },
    {
      title: 'Returns & Replacements',
      type: 'returns',
      description: 'Email templates for handling product returns and replacements',
      mailers: [
        { title: 'Replace Confirmation', type: 'replace-confirmation' },
        { title: 'Replace Initiated', type: 'replace-initiated' },
        { title: 'Replace Rejected', type: 'replace-rejected' }
      ]
    },
    {
      title: 'Support & Enquiries',
      type: 'support',
      description: 'Email templates for customer support and enquiries',
      mailers: [
        { title: 'Support Email Verification', type: 'support-email-verification' },
        { title: 'Enquiry Submission', type: 'enquiry-submission' },
        { title: 'Enquiry Thank You', type: 'enquiry-thanking' }
      ]
    },
    {
      title: 'Vouchers & Promotions',
      type: 'vouchers',
      description: 'Email templates for vouchers and promotional content',
      mailers: [
        { title: 'Voucher Confirmation', type: 'voucher-confirmation' },
        { title: 'Voucher Gift', type: 'voucher-gift' }
      ]
    },
    {
      title: 'Administrative',
      type: 'administrative',
      description: 'Email templates for administrative purposes',
      mailers: [
        { title: 'Dashboard Notification', type: 'dashboard-notification' },
        { title: 'Admin Export Download', type: 'admin-export-download' }
      ]
    }
  ];
  mailerItems: Array<any> = [];
  form: FormGroup;
  bodyContent: SafeHtml;

  constructor(
    private CustomMailerService: CustomMailerService,
    private Toast: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.mailerType = this.ActivatedRoute.snapshot.queryParams.type || 'authentication';
    this.mailerItems = this.mailers.find(
      (mailer) => mailer.type == this.mailerType
    ).mailers;
    this.form = new FormGroup({
      subject: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      type: new FormControl(this.mailerItems[0].type, Validators.required),
    });

    this.getMailerDetails(this.mailerItems[0].type);
  }

  toggleMailer(type: string) {
    this.form.patchValue({ subject: '', type: type, email: '' });
    this.getMailerDetails(type);
    this.isSubmitted = false;
  }

  getMailerDetails(type: string) {
    this.CustomMailerService.customMailers(type).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result);
          this.bodyContent = this.extractBodyContent(res?.result?.email);
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  detectEmailChanges() {
    this.bodyContent = this.extractBodyContent(this.form.value.email);
  }

  extractBodyContent(htmlString: string): SafeHtml {
    const bodyStartIndex = htmlString.indexOf('<body>');
    const bodyEndIndex = htmlString.indexOf('</body>');
    if (bodyStartIndex !== -1 && bodyEndIndex !== -1) {
      let subString = htmlString.substring(
        bodyStartIndex + '<body>'.length,
        bodyEndIndex
      );
      return this.sanitizer.bypassSecurityTrustHtml(subString);
    } else {
      return '';
    }
  }

  manageMailer() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.CustomMailerService.manageCustomMailers(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getMailerDetails(this.form.value.type);
          this.Toast.success(res?.message);
          this.isSubmitted = false;
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }
}