import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '../core/auth/authentication.guard';
import { MyAccountComponent } from './my-account/my-account.component';
import { SeoDetailsComponent } from './settings/general/seo-details/seo-details.component';
import { TimeslotsComponent } from './settings/general/timeslots/timeslots.component';
import { EnquiresComponent } from './sales/enquires/enquires.component';
import { PermissionGuard } from '../core/auth/permission.guard';
import { DynamicScriptsComponent } from './settings/general/dynamic-scripts/dynamic-scripts.component';
import { AnalyticsComponent } from './settings/general/analytics/analytics.component';
import { FeedsComponent } from './marketing/feeds/feeds.component';
import { NavigationMenuComponent } from './settings/general/navigation-menu/navigation-menu.component';
import { SubscribersComponent } from './users/subscribers/subscribers.component';
import { ServiceWarrantyComponent } from './pages/service-warranty/service-warranty.component';
import { PaymentPolicyComponent } from './pages/payment-policy/payment-policy.component';
import { ShippingPolicyComponent } from './pages/shipping-policy/shipping-policy.component';
import { RefundPolicyComponent } from './pages/refund-policy/refund-policy.component';
import { MobileAppsComponent } from './settings/general/mobile-apps/mobile-apps.component';
import { MailerComponent } from './settings/general/mailer/mailer.component';
import { ShippingComponent } from './settings/general/shipping/shipping.component';
import { MonthlyComparisonComponent } from './monthly-comparison/monthly-comparison.component';
import { StorePopupComponent } from './marketing/store-popup/store-popup.component';
import { ActivitiesComponent } from './settings/general/activities/activities.component';
import { SalesAnalyticsComponent } from './sales-analytics/sales-analytics.component';
import { DeliverySlotsComponent } from './settings/general/delivery-slots/delivery-slots.component';
import { LoyaltyComponent } from './marketing/loyalty/loyalty.component';
import { ReferralComponent } from './marketing/referral/referral.component';
import { NewsletterSubscribersComponent } from './users/customers/newsletter-subscribers/newsletter-subscribers.component';
import { GiftWrapComponent } from './marketing/gift-wrap/gift-wrap.component';
import { BannerImagesComponent } from './marketing/banner-images/banner-images.component';
import { CustomMailersComponent } from './settings/general/custom-mailers/custom-mailers.component';
import { MailerDetailsComponent } from './settings/general/mailer-details/mailer-details.component';
import { GuestsComponent } from './users/guests/guests.component';
import { ShippingChargeComponent } from './settings/general/shipping-charge/shipping-charge.component';
import { PageCoversComponent } from './page-covers/page-covers.component';
import { PaymentSettingsComponent } from './settings/general/payment-settings/payment-settings.component';
import { CreateProductsComponent } from './catalog/product/create-products/create-products.component';
import { ShippingRulesComponent } from './settings/general/shipping-rules/shipping-rules.component';
import { InternationalisationComponent } from './settings/general/internationalisation/internationalisation.component';
import { SmsSettingsComponent } from './settings/general/sms-settings/sms-settings.component';
import { AuthenticationComponent } from './settings/general/authentication/authentication.component';
import { AppKeysComponent } from './settings/general/app-keys/app-keys.component';
import { CartSettingsComponent } from './settings/general/cart-settings/cart-settings.component';
import { ProductDesignsComponent } from './store-designs/product-designs/product-designs.component';
import { OrderSettingsComponent } from './settings/general/order-settings/order-settings.component';
import { FiltersComponent } from './catalog/filters/filters.component';
import { SitemapSettingsComponent } from './settings/general/sitemap-settings/sitemap-settings.component';
import { CompareKeysComponent } from './catalog/compare-keys/compare-keys.component';

export const Routing: Routes = [
  {
    path: 'app',
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'brands',
        children: [
          {
            path: '',
            loadChildren: () => import('./catalog/brand/brand-list/brand-list.module').then((m) => m.BrandModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'add',
            loadChildren: () => import('./catalog/brand/add-brand/add-brand.module').then((m) => m.AddBrandModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'update',
            loadChildren: () => import('./catalog/brand/update-brand/update-brand.module').then((m) => m.UpdateBrandModule),
            canActivate: [PermissionGuard]
          },
        ],
        canActivate: [AuthenticationGuard]
      }, {
        path: 'category',
        children: [
          {
            path: '',
            loadChildren: () => import('./catalog/category/category-list/category-list.module').then((m) => m.CategoryModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'add',
            loadChildren: () => import('./catalog/category/add-category/add-category.module').then((m) => m.AddCategoryModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'update',
            loadChildren: () => import('./catalog/category/update-category/update-category.module').then((m) => m.UpdateCategoryModule),
            canActivate: [PermissionGuard]
          },
        ],
        canActivate: [AuthenticationGuard]
      }, {
        path: 'collection',
        children: [
          {
            path: '',
            loadChildren: () => import('./catalog/collection/collection-list/collection-list.module').then((m) => m.CollectionModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'add',
            loadChildren: () => import('./catalog/collection/add-collection/add-collection.module').then((m) => m.AddCollectionModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'update',
            loadChildren: () => import('./catalog/collection/update-collection/update-collection.module').then((m) => m.UpdateCollectionModule),
            canActivate: [PermissionGuard]
          },
        ],
        canActivate: [AuthenticationGuard]
      }, {
        path: '',
        children: [
          {
            path: '',
            loadChildren: () => import('./catalog/product/product-list/product-list.module').then((m) => m.ProductModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'product/add',
            loadChildren: () => import('./catalog/product/add-product/add-product.module').then((m) => m.AddProductModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'product/update',
            loadChildren: () => import('./catalog/product/update-product/update-product.module').then((m) => m.UpdateProductModule),
            canActivate: [PermissionGuard]
          },
        ],
        canActivate: [AuthenticationGuard]
      }, {
        path: '',
        children: [
          {
            path: 'offer',
            loadChildren: () => import('./marketing/offer/offer-list/offer-list.module').then((m) => m.OfferModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'add-offer',
            loadChildren: () => import('./marketing/offer/add-offer/add-offer.module').then((m) => m.AddOfferModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'update-offer',
            loadChildren: () => import('./marketing/offer/update-offer/update-offer.module').then((m) => m.UpdateOfferModule),
            canActivate: [PermissionGuard]
          },
        ],
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'tax-classes',
        children: [
          {
            path: '',
            loadChildren: () => import('./settings/localization/tax/tax-classes/tax-class-list/tax-class-list.component.module').then((m) => m.TaxClassModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'add',
            loadChildren: () => import('./settings/localization/tax/tax-classes/add-tax-class/add-tax-class.component.module').then((m) => m.AddTaxClassModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'update',
            loadChildren: () => import('./settings/localization/tax/tax-classes/update-tax-class/update-tax-class.component.module').then((m) => m.UpdateTaxClassModule),
            canActivate: [PermissionGuard]
          },
        ],
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'tax-rules',
        children: [
          {
            path: '',
            loadChildren: () => import('./settings/localization/tax/tax-rules/tax-rules-list/tax-rules-list.component.module').then((m) => m.TaxRulesModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'add',
            loadChildren: () => import('./settings/localization/tax/tax-rules/add-tax-rules/add-tax-rules.component.module').then((m) => m.AddTaxClassModule),
            canActivate: [PermissionGuard]
          },
          {
            path: 'update',
            loadChildren: () => import('./settings/localization/tax/tax-rules/update-tax-rules/update-tax-rules.component.module').then((m) => m.UpdateTaxClassModule),
            canActivate: [PermissionGuard]
          },
        ],
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'admin-users',
        loadChildren: () => import('./users/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then((m) => m.RolesModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'orders',
        loadChildren: () => import('./sales/orders/placed-orders/orders.module').then((m) => m.OrdersModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'pending-orders',
        loadChildren: () => import('./sales/orders/pending-orders/pending-orders.module').then((m) => m.PendingOrdersModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'customers',
        loadChildren: () => import('./users/customers/customers.module').then((m) => m.CustomersModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'guests',
        component: GuestsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'user-alerts',
        component: SubscribersComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'coupons',
        loadChildren: () => import('./marketing/coupons/coupons.module').then((m) => m.CouponsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'contacts',
        loadChildren: () => import('./settings/general/contact/contact.module').then((m) => m.ContactModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'social-media',
        loadChildren: () => import('./settings/general/social.media/social.media.module').then((m) => m.SocialMediaModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'invoice-settings',
        loadChildren: () => import('./settings/general/invoice-settings/invoice-settings.module').then((m) => m.InvoiceSettingsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'create-products',
        component: CreateProductsComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'banners',
        loadChildren: () => import('./design/banners/banners.module').then((m) => m.BannersModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'returns',
        loadChildren: () => import('./returns/returns.module').then((m) => m.ReturnsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'referral',
        component: ReferralComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'filters',
        component: FiltersComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'compare-keys',
        component: CompareKeysComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'newsletter-subscribers',
        component: NewsletterSubscribersComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'layouts',
        loadChildren: () => import('./design/layouts/layouts.module').then((m) => m.LayoutsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'blogs',
        loadChildren: () => import('./marketing/blogs/blogs.module').then((m) => m.BlogsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'cart',
        loadChildren: () => import('./sales/cart/cart.module').then((m) => m.CartModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'reviews',
        loadChildren: () => import('./sales/reviews/reviews.module').then((m) => m.ReviewsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'faq',
        loadChildren: () => import('./settings/general/faq/faq.module').then((m) => m.FaqModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'testimonials',
        loadChildren: () => import('./settings/general/testimonials/testimonials.module').then((m) => m.TestimonialsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      },
      {
        path: 'notifications',
        loadChildren: () => import('./marketing/notifications/notifications.module').then((m) => m.NotificationsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'static-pages',
        loadChildren: () => import('./static-pages/static-pages.module').then((m) => m.StaticPagesModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'help-center',
        loadChildren: () => import('./pages/help-center/help-center.module').then((m) => m.HelpCenterModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'privacy-policy',
        loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'terms-conditions',
        loadChildren: () => import('./pages/terms-conditions/terms-conditions.module').then((m) => m.TermsConditionsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'store-settings',
        loadChildren: () => import('./settings/general/app-settings/app-settings.module').then((m) => m.AppSettingsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'mobile-apps',
        component: MobileAppsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'home-settings',
        loadChildren: () => import('./settings/general/dashboard-settings/dashboard-settings.module').then((m) => m.DashboardSettingsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'shipping',
        loadChildren: () => import('./sales/shipping/shipping.module').then((m) => m.ShippingModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'bulk-upload',
        loadChildren: () => import('./settings/general/bulk-upload/bulk-upload.module').then((m) => m.BulkUploadModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'my-account',
        component: MyAccountComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'mailer-subscriptions',
        component: MailerComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'payment-settings',
        component: PaymentSettingsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'order-settings',
        component: OrderSettingsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'seo-details',
        component: SeoDetailsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'monthly-comparison',
        component: MonthlyComparisonComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'sales-analytics',
        component: SalesAnalyticsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'internationalization',
        component: InternationalisationComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'replace-requests',
        loadChildren: () => import('./replace-requests/replace-requests.module').then((m) => m.ReplaceRequestsModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'activity-logs',
        component: ActivitiesComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'gift-wrap',
        component: GiftWrapComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'banner-images',
        component: BannerImagesComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'shipping-charges',
        component: ShippingChargeComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'store-popup',
        component: StorePopupComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'timer-settings',
        component: ProductDesignsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'sitemap-settings',
        component: SitemapSettingsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'time-slots',
        component: TimeslotsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'delivery-slots',
        component: DeliverySlotsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'media-library',
        loadChildren: () => import('./media-library/media-library.module').then((m) => m.MediaLibraryModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'vouchers',
        loadChildren: () => import('./marketing/vouchers/vouchers.module').then((m) => m.VouchersModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'app-keys',
        component: AppKeysComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'stores',
        loadChildren: () => import('./settings/general/store/store.module').then((m) => m.StoreModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'enquiries',
        component: EnquiresComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'pickup-locations',
        loadChildren: () => import('./settings/general/pickup/pickup.module').then((m) => m.PickupModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'wishlist',
        loadChildren: () => import('./sales/wishlist/wishlist.module').then((m) => m.WishlistModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'cart-settings',
        component: CartSettingsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'more-offers',
        loadChildren: () => import('./marketing/more-offers/more-offers.module').then((m) => m.MoreOffersModule),
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'dynamic-scripts',
        component: DynamicScriptsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'analytics',
        component: AnalyticsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'page-covers',
        component: PageCoversComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'loyalty',
        component: LoyaltyComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'feeds',
        component: FeedsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'custom-mailers',
        component: CustomMailersComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'mailer-details',
        component: MailerDetailsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'navigation',
        component: NavigationMenuComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'shipping-policy',
        component: ShippingPolicyComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'shipping-rules',
        component: ShippingRulesComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'payment-policy',
        component: PaymentPolicyComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'service-warranty',
        component: ServiceWarrantyComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'auth-settings',
        component: AuthenticationComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'refund-policy',
        component: RefundPolicyComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'shipping-settings',
        component: ShippingComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }, {
        path: 'sms-settings',
        component: SmsSettingsComponent,
        canActivate: [AuthenticationGuard, PermissionGuard]
      }
    ]
  }, {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(Routing, {
      scrollPositionRestoration: 'disabled'
    }),
  ],
  exports: [RouterModule],
})
export class RoutingModule { }
