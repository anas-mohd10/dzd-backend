import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/includes/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  private modulePathMap: { [key: string]: (subModule?: string) => string } = {
    brands: (subItem) => (subItem === 'add' ? 'add-brand' : subItem === 'update' ? 'update-brand' : 'brand'),
    category: (subItem) => (subItem === 'add' ? 'add-category' : subItem === 'update' ? 'update-category' : 'category'),
    collection: (subItem) => (subItem === 'add' ? 'add-collection' : subItem === 'update' ? 'update-collection' : 'collection'),
    'static-pages': (subItem) => (subItem === 'add' ? 'add-staticpages' : subItem === 'update' ? 'update-staticpages' : 'static-pages'),
    orders: (subItem) => (subItem === 'add' ? 'add-order' : subItem === 'update' ? 'update-order' : 'orders'),
    'admin-users': (subItem) => (subItem === 'add' ? 'add-adminusers' : subItem === 'update' ? 'update-adminusers' : 'admin-users'),
    testimonials: (subItem) => (subItem === 'add' ? 'add-testimonials' : subItem === 'update' ? 'update-testimonials' : 'testimonials'),
    product: (subItem) => (subItem === 'add' ? 'add-product' : subItem === 'update' ? 'update-product' : 'product'),
    'product-head': (subItem) => (subItem === 'add' ? 'add-product-head' : subItem === 'update' ? 'update-product-head' : 'product-head'),
    notifications: (subItem) => (subItem === 'add' ? 'add-notifications' : subItem === 'update' ? 'update-notifications' : 'notifications'),
    bloggers: (subItem) => (subItem === 'add' ? 'add-blogs' : subItem === 'update' ? 'update-blogs' : 'blogs'),
    vouchers: (subItem) => (subItem === 'create' ? 'add-vouchers' : subItem === 'update' ? 'update-blogs' : 'blogs'), // Note: Seems voucher update directs to blogs, verify
    coupons: (subItem) => (subItem === 'add' ? 'add-coupons' : subItem === 'update' ? 'update-coupons' : 'coupons'),
    customers: (subItem) => (subItem === 'add' ? 'add-customers' : subItem === 'update' ? 'update-customers' : 'customers'),
    'social-media': (subItem) => (subItem === 'add' ? 'add-social-media' : subItem === 'update' ? 'update-social-media' : 'social-media'),
    roles: (subItem) => (subItem === 'add' ? 'add-roles' : subItem === 'update' ? 'update-roles' : 'roles'),
    stores: (subItem) => (subItem === 'add' ? 'add-stores' : subItem === 'update' ? 'update-stores' : 'stores'),
    'pickup-locations': (subItem) => (subItem === 'add' ? 'add-pickup-locations' : subItem === 'update' ? 'update-pickup-locations' : 'pickup-locations'),
    faq: (subItem) => (subItem === 'add' ? 'add-faq' : subItem === 'update' ? 'update-faq' : 'faq'),
    'tax-rules': (subItem) => (subItem === 'add' ? 'add-tax-rules' : subItem === 'update' ? 'update-tax-rules' : 'tax-rules'),
    'tax-classes': (subItem) => (subItem === 'add' ? 'add-tax-classes' : subItem === 'update' ? 'update-tax-classes' : 'tax-classes'),
  };

  private simplePaths = new Set([
    'payment-settings', 'order-settings', 'filters', 'locations', 'menu-navigations', 'compare-keys', 'help-center',
    'returns', 'media-library', 'guests', 'feeds', 'monthly-comparison', 'sales-analytics', 'albums', 'galleries',
    'offer', 'add-offer', 'update-offer', 'loyalty', 'referral', 'gift-wrap', 'delivery-slots', 'sitemap',
    'custom-mailers', 'mailer-details', 'mailer-subscriptions', 'store-settings', 'sitemap-settings', 'form-settings',
    'export-logs', 'cart-settings', 'app-keys', 'designs', 'internationalization', 'toasts', 'sms-settings',
    'timer-settings', 'auth-settings', 'seo-details', 'banner-images', 'activity-logs', 'reviews', 'user-alerts',
    'cart', 'enquiries', 'wishlist', 'dynamic-scripts', 'analytics', 'mobile-apps', 'page-covers', 'shipping-policy',
    'shipping-charges', 'shipping-rules', 'shipping-settings', 'refund-policy', 'privacy-policy', 'terms-and-conditions',
    'payment-policy', 'service-warranty', 'navigation', 'bulk-upload', 'reports', 'invoice-settings', 'store-popup'
  ]);

  constructor(
    private AuthService: AuthService,
    private Router: Router,
  ) { }

  private stripQueryParams(segment: string): string {
    return segment.split('?')[0];
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const paths = state.url.split('/app/');
    // If URL is not in expected format, deny access
    if (!paths[1]) {
      return false;
    }
    const moduleSegments = paths[1].split('/');

    // Clean first segment of query params
    moduleSegments[0] = this.stripQueryParams(moduleSegments[0]);

    const mainModule = moduleSegments[0];
    const subModule = moduleSegments[1] ? this.stripQueryParams(moduleSegments[1]) : undefined;

    let path = '';

    if (this.modulePathMap[mainModule]) {
      path = this.modulePathMap[mainModule](subModule);
    } else if (this.simplePaths.has(mainModule)) {
      path = mainModule;
    } else {
      // Optional: fallback or deny if unknown module
      path = mainModule;
    }

    return this.AuthService.authorizeUser(path).pipe(
      map((res: any) => {
        if (res?.errorCode === 0) {

          if (res?.result?.isStoreLive == false && res?.result?.isDeveloperAccess == false) {
            localStorage.clear(); // Clear local storage
            return this.Router.parseUrl('/auth/login');
          }

          if (res?.result?.isAccessDenied) {
            return this.Router.parseUrl('/access-denied');
          }
          return true;
        }
        return false;
      })
    );
  }
}
