import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-custom-mailers',
  templateUrl: './custom-mailers.component.html',
  styleUrls: ['./custom-mailers.component.scss']
})
export class CustomMailersComponent implements OnInit {
  appRoute = appRoutes
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
    }, {
      title: 'Users',
      type: 'users',
      description: 'Email templates related to user related items',
      mailers: [
        { title: 'Manage Wallet', type: 'manage-wallet' }
      ]
    }, {
      title: 'Orders',
      type: 'orders',
      description: 'Email templates for order management and updates',
      mailers: [
        { title: 'Order Placed', type: 'order-placed' },
        { title: 'Order Accepted', type: 'order-accepted' },
        { title: 'Order Delivered', type: 'order-delivered' },
        { title: 'Order Cancelled', type: 'order-cancelled' },
        { title: 'Admin Order Notification', type: 'admin-place-order-notification' }
      ]
    }, {
      title: 'Newsletter',
      type: 'newsletters',
      description: 'Email templates for newsletter management',
      mailers: [
        { title: 'Newsletter Subscribed', type: 'newsletter-subscribed' },
        { title: 'Newsletter Unsubscribed', type: 'newsletter-unsubscribed' },
        { title: 'Newsletter Verification', type: 'newsletter-verification' },
        { title: 'Newsletter Notification', type: 'newsletter-notification' }
      ]
    }, {
      title: 'Cart & Wishlist',
      type: 'cart-wishlist',
      description: 'Email templates for abandoned cart and wishlist reminders',
      mailers: [
        { title: 'Abandoned Cart', type: 'abandoned-cart' },
        { title: 'Abandoned Wishlist', type: 'abandoned-wishlist' }
      ]
    }, {
      title: 'Returns & Replacements',
      type: 'returns',
      description: 'Email templates for handling product returns and replacements',
      mailers: [
        { title: 'Replace Confirmation', type: 'replace-confirmation' },
        { title: 'Replace Initiated', type: 'replace-initiated' },
        { title: 'Replace Rejected', type: 'replace-rejected' }
      ]
    }, {
      title: 'Support & Enquiries',
      type: 'support',
      description: 'Email templates for customer support and enquiries',
      mailers: [
        { title: 'Support Email Verification', type: 'support-email-verification' },
        { title: 'Enquiry Submission', type: 'enquiry-submission' },
        { title: 'Enquiry Thank You', type: 'enquiry-thanking' }
      ]
    }, {
      title: 'Vouchers & Promotions',
      type: 'vouchers',
      description: 'Email templates for vouchers and promotional content',
      mailers: [
        { title: 'Voucher Confirmation', type: 'voucher-confirmation' },
        { title: 'Voucher Gift', type: 'voucher-gift' }
      ]
    }, {
      title: 'Administrative',
      type: 'administrative',
      description: 'Email templates for administrative purposes',
      mailers: [
        { title: 'Dashboard Notification', type: 'dashboard-notification' },
        { title: 'Admin Export Download', type: 'admin-export-download' }
      ]
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }
}