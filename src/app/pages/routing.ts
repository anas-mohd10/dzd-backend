import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '../core/auth/authentication.guard';

export const Routing: Routes = [
  {
    path: 'app',
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import("./catalog/variant-product/dashboard/dashboard.module").then((m) => m.DashboardModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'brand',
        children: [
          {
            path: '',
            loadChildren: () => import('./catalog/brand/brand-list/brand-list.module').then((m) => m.BrandModule),
          },
          {
            path: 'add',
            loadChildren: () => import('./catalog/brand/add-brand/add-brand.module').then((m) => m.AddBrandModule),
          },
          {
            path: 'update',
            loadChildren: () => import('./catalog/brand/update-brand/update-brand.module').then((m) => m.UpdateBrandModule),
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
          },
          {
            path: 'add',
            loadChildren: () => import('./catalog/category/add-category/add-category.module').then((m) => m.AddCategoryModule),
          },
          {
            path: 'update',
            loadChildren: () => import('./catalog/category/update-category/update-category.module').then((m) => m.UpdateCategoryModule),
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
          },
          {
            path: 'add',
            loadChildren: () => import('./catalog/collection/add-collection/add-collection.module').then((m) => m.AddCollectionModule),
          },
          {
            path: 'update',
            loadChildren: () => import('./catalog/collection/update-collection/update-collection.module').then((m) => m.UpdateCollectionModule),
          },
        ],
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'product',
        children: [
          {
            path: '',
            loadChildren: () => import('./catalog/product/product-list/product-list.module').then((m) => m.ProductModule),
          },
          {
            path: 'add',
            loadChildren: () => import('./catalog/product/add-product/add-product.module').then((m) => m.AddProductModule),
          },
          {
            path: 'update',
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
        path: 'offer',
        children: [
          {
            path: '',
            loadChildren: () => import('./marketing/offer/offer-list/offer-list.module').then((m) => m.OfferModule),
          },
          {
            path: 'add',
            loadChildren: () => import('./marketing/offer/add-offer/add-offer.module').then((m) => m.AddOfferModule),
          },
          {
            path: 'update',
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
        path: 'shipping',
        children: [
          {
            path: '',
            loadChildren: () => import('./sales/shipping/shipping-list/shipping-list.module').then((m) => m.ShippingModule),
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
        path: 'placed-orders',
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
        path: 'product-report',
        loadChildren: () => import('./reports/product-report/product-report.module').then((m) => m.ProductReportModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'customer-report',
        loadChildren: () => import('./reports/customer-report/customer-report.module').then((m) => m.CustomerReportModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'order-report',
        loadChildren: () => import('./reports/order-report/order-report.module').then((m) => m.OrderReportModule),
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
      },
      {
        path: 'page-limits',
        loadChildren: () => import('./settings/general/page-limits/page-limits.module').then((m) => m.PageLimitsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'app-settings',
        loadChildren: () => import('./settings/general/app-settings/app-settings.module').then((m) => m.AppSettingsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'home-settings',
        loadChildren: () => import('./settings/general/dashboard-settings/dashboard-settings.module').then((m) => m.DashboardSettingsModule),
        canActivate: [AuthenticationGuard]
      },
    ]
  },
  {
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
