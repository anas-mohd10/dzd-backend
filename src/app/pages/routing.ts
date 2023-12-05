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

export const Routing: Routes = [
  {
    path: 'app',
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'brand',
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
      },
      {
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
      },
      {
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
      },
      {
        path: '',
        children: [
          {
            path: '',
            loadChildren: () => import('./catalog/product/product-list/product-list.module').then((m) => m.ProductModule),
          },
          {
            path: 'product/add',
            loadChildren: () => import('./catalog/product/add-product/add-product.module').then((m) => m.AddProductModule),
          },
          {
            path: 'product/update',
            loadChildren: () => import('./catalog/product/update-product/update-product.module').then((m) => m.UpdateProductModule),
          },
        ],
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'variant-product',
        children: [
          {
            path: '',
            loadChildren: () => import('./catalog/variant-product/variant-product-list/variant-product-list.module').then((m) => m.VariantProductModule),
          },
          {
            path: 'add',
            loadChildren: () => import('./catalog/variant-product/add-variant-product/add-variant-product.module').then((m) => m.AddVariantProductModule),
          },
          {
            path: 'update',
            loadChildren: () => import('./catalog/variant-product/update-variant-product/update-variant-product.module').then((m) => m.UpdateVariantProductModule),
          }
        ],
        canActivate: [AuthenticationGuard]
      },
      {
        path: '',
        children: [
          {
            path: 'offer',
            loadChildren: () => import('./marketing/offer/offer-list/offer-list.module').then((m) => m.OfferModule),
          },
          {
            path: 'add-offer',
            loadChildren: () => import('./marketing/offer/add-offer/add-offer.module').then((m) => m.AddOfferModule),
          },
          {
            path: 'update-offer',
            loadChildren: () => import('./marketing/offer/update-offer/update-offer.module').then((m) => m.UpdateOfferModule),
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
          },
          {
            path: 'add',
            loadChildren: () => import('./settings/localization/tax/tax-classes/add-tax-class/add-tax-class.component.module').then((m) => m.AddTaxClassModule),
          },
          {
            path: 'update',
            loadChildren: () => import('./settings/localization/tax/tax-classes/update-tax-class/update-tax-class.component.module').then((m) => m.UpdateTaxClassModule),
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
          },
          {
            path: 'add',
            loadChildren: () => import('./settings/localization/tax/tax-rules/add-tax-rules/add-tax-rules.component.module').then((m) => m.AddTaxClassModule),
          },
          {
            path: 'update',
            loadChildren: () => import('./settings/localization/tax/tax-rules/update-tax-rules/update-tax-rules.component.module').then((m) => m.UpdateTaxClassModule),
          },
        ],
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'admin-users',
        loadChildren: () => import('./users/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then((m) => m.RolesModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'orders',
        loadChildren: () => import('./sales/orders/placed-orders/orders.module').then((m) => m.OrdersModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'pending-orders',
        loadChildren: () => import('./sales/orders/pending-orders/pending-orders.module').then((m) => m.PendingOrdersModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'customers',
        loadChildren: () => import('./users/customers/customers.module').then((m) => m.CustomersModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'user-alerts',
        component: SubscribersComponent,
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'coupons',
        loadChildren: () => import('./marketing/coupons/coupons.module').then((m) => m.CouponsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'contacts',
        loadChildren: () => import('./settings/general/contact/contact.module').then((m) => m.ContactModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'social-media',
        loadChildren: () => import('./settings/general/social.media/social.media.module').then((m) => m.SocialMediaModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'invoice-settings',
        loadChildren: () => import('./settings/general/invoice-settings/invoice-settings.module').then((m) => m.InvoiceSettingsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'return-lists',
        loadChildren: () => import('./sales/returns/returns.module').then((m) => m.ReturnsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'banners',
        loadChildren: () => import('./design/banners/banners.module').then((m) => m.BannersModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'layouts',
        loadChildren: () => import('./design/layouts/layouts.module').then((m) => m.LayoutsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'cart',
        loadChildren: () => import('./sales/cart/cart.module').then((m) => m.CartModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'vouchers',
        loadChildren: () => import('./sales/vouchers/vouchers.module').then((m) => m.VouchersModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'reviews',
        loadChildren: () => import('./sales/reviews/reviews.module').then((m) => m.ReviewsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'faq',
        loadChildren: () => import('./settings/general/faq/faq.module').then((m) => m.FaqModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'testimonials',
        loadChildren: () => import('./settings/general/testimonials/testimonials.module').then((m) => m.TestimonialsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'notifications',
        loadChildren: () => import('./marketing/notifications/notifications.module').then((m) => m.NotificationsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'about',
        loadChildren: () => import('./pages/about/about.module').then((m) => m.AboutModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'help-center',
        loadChildren: () => import('./pages/help-center/help-center.module').then((m) => m.HelpCenterModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'terms-conditions',
        loadChildren: () => import('./pages/terms-conditions/terms-conditions.module').then((m) => m.TermsConditionsModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'page-limits',
        loadChildren: () => import('./settings/general/page-limits/page-limits.module').then((m) => m.PageLimitsModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'store-settings',
        loadChildren: () => import('./settings/general/app-settings/app-settings.module').then((m) => m.AppSettingsModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'mobile-apps',
        component: MobileAppsComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'home-settings',
        loadChildren: () => import('./settings/general/dashboard-settings/dashboard-settings.module').then((m) => m.DashboardSettingsModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'shipping',
        loadChildren: () => import('./sales/shipping/shipping.module').then((m) => m.ShippingModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'bulk-upload',
        loadChildren: () => import('./settings/general/bulk-upload/bulk-upload.module').then((m) => m.BulkUploadModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'my-account',
        component: MyAccountComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'mailer-subscriptions',
        component: MailerComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'seo-details',
        component: SeoDetailsComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'monthly-comparison',
        component: MonthlyComparisonComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'activity-logs',
        component: ActivitiesComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'store-popup',
        component: StorePopupComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'time-slots',
        component: TimeslotsComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'media-library',
        loadChildren: () => import('./media-library/media-library.module').then((m) => m.MediaLibraryModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'stores',
        loadChildren: () => import('./settings/general/store/store.module').then((m) => m.StoreModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'enquiries',
        component: EnquiresComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'wishlist',
        loadChildren: () => import('./sales/wishlist/wishlist.module').then((m) => m.WishlistModule),
        canActivate: [AuthenticationGuard]
      }, {
        path: 'dynamic-scripts',
        component: DynamicScriptsComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'analytics',
        component: AnalyticsComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'feeds',
        component: FeedsComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'navigation',
        component: NavigationMenuComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'shipping-policy',
        component: ShippingPolicyComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'payment-policy',
        component: PaymentPolicyComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'service-warranty',
        component: ServiceWarrantyComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'refund-policy',
        component: RefundPolicyComponent,
        canActivate: [AuthenticationGuard]
      }, {
        path: 'shipping-settings',
        component: ShippingComponent,
        canActivate: [AuthenticationGuard]
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
