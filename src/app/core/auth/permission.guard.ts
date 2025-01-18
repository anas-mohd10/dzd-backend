import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/includes/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let paths = state.url.split('/app/');
    let module = paths[1].split('/')
    let path = ''

    if (module[0].includes('mailer-details')) {
      module[0] = module[0].split('?')[0]
    }

    switch (module[0]) {
      case 'brands':
        module[1] == 'add' ? path = 'add-brand' : module[1] == 'update' ? path = 'update-brand' : path = 'brand'
        break
      case 'category':
        module[1] == 'add' ? path = 'add-category' : module[1] == 'update' ? path = 'update-category' : path = 'category'
        break
      case 'collection':
        module[1] == 'add' ? path = 'add-collection' : module[1] == 'update' ? path = 'update-collection' : path = 'collection'
        break
      case 'static-pages':
        module[1] == 'add' ? path = 'add-staticpages' : module[1] == 'update' ? path = 'update-staticpages' : path = 'static-pages'
        break
      case 'orders':
        module[1] == 'add' ? path = 'add-order' : module[1] == 'update' ? path = 'update-order' : path = 'orders'
        break
      case 'admin-users':
        module[1] == 'add' ? path = 'add-adminusers' : module[1] == 'update' ? path = 'update-adminusers' : path = 'admin-users'
        break
      case 'testimonials':
        module[1] == 'add' ? path = 'add-testimonials' : module[1] == 'update' ? path = 'update-testimonials' : path = 'testimonials'
        break
      case 'product':
        module[1] == 'add' ? path = 'add-product' : module[1] == 'update' ? path = 'update-product' : path = 'product'
        break
      case 'product-head':
        module[1] == 'add' ? path = 'add-product-head' : module[1] == 'update' ? path = 'update-product-head' : path = 'product-head'
        break
      case 'notifications':
        module[1] == 'add' ? path = 'add-notifications' : module[1] == 'update' ? path = 'update-notifications' : path = 'notifications'
        break
      case 'payment-settings':
        module[0] == 'payment-settings' ? path = 'payment-settings' : null
        break
      case 'order-settings':
        module[0] == 'order-settings' ? path = 'order-settings' : null
        break
      case 'filters':
        module[0] == 'filters' ? path = 'filters' : null
        break
      case 'compare-keys':
        module[0] == 'compare-keys' ? path = 'compare-keys' : null
        break
      case 'help-center':
        module[0] == 'help-center' ? path = 'help-center' : null
        break
      case 'returns':
        module[0] == 'returns' ? path = 'returns' : null
        break
      case 'media-library':
        module[0] == 'media-library' ? path = 'media-library' : null
        break
      case 'guests':
        module[0] == 'guests' ? path = 'guests' : null
        break
      case 'feeds':
        module[0] == 'feeds' ? path = 'feeds' : null
        break
      case 'monthly-comparison':
        module[0] == 'monthly-comparison' ? path = 'monthly-comparison' : null
        break
      case 'sales-analytics':
        module[0] == 'sales-analytics' ? path = 'sales-analytics' : null
        break
      case 'blogs':
        module[1] == 'add' ? path = 'add-blogs' : module[1] == 'update' ? path = 'update-blogs' : path = 'blogs'
        break
      case 'vouchers':
        module[1] == 'create' ? path = 'add-vouchers' : module[1] == 'update' ? path = 'update-blogs' : path = 'blogs'
        break
      case 'coupons':
        module[1] == 'add' ? path = 'add-coupons' : module[1] == 'update' ? path = 'update-coupons' : path = 'coupons'
        break
      case 'offer':
        module[0] == 'offer' ? path = 'offer' : null
        break
      case 'add-offer':
        module[0] == 'add-offer' ? path = 'add-offer' : null
        break
      case 'update-offer':
        module[0] == 'update-offer' ? path = 'update-offer' : null
        break
      case 'loyalty':
        module[0] == 'loyalty' ? path = 'loyalty' : null
        break
      case 'referral':
        module[0] == 'referral' ? path = 'referral' : null
        break
      case 'gift-wrap':
        module[0] == 'gift-wrap' ? path = 'gift-wrap' : null
        break
      case 'delivery-slots':
        module[0] == 'delivery-slots' ? path = 'delivery-slots' : null
        break
      case 'sitemap':
        module[0] == 'sitemap' ? path = 'sitemap' : null
        break
      case 'custom-mailers':
        module[0] == 'custom-mailers' ? path = 'custom-mailers' : null
        break
      case 'mailer-details':
        module[0] == 'mailer-details' ? path = 'mailer-details' : null
        break
      case 'mailer-subscriptions':
        module[0] == 'mailer-subscriptions' ? path = 'mailer-subscriptions' : null
        break
      case 'customers':
        module[1] == 'add' ? path = 'add-customers' : module[1] == 'update' ? path = 'update-customers' : path = 'customers'
        break
      case 'social-media':
        module[1] == 'add' ? path = 'add-social-media' : module[1] == 'update' ? path = 'update-social-media' : path = 'social-media'
        break
      case 'roles':
        module[1] == 'add' ? path = 'add-roles' : module[1] == 'update' ? path = 'update-roles' : path = 'roles'
        break
      case 'store-settings':
        module[0] == 'store-settings' ? path = 'store-settings' : null
        break
      case 'sitemap-settings':
        module[0] == 'sitemap-settings' ? path = 'sitemap-settings' : null
        break
      case 'stores':
        module[1] == 'add' ? path = 'add-stores' : module[1] == 'update' ? path = 'update-stores' : path = 'stores'
        break
      case 'pickup-locations':
        module[1] == 'add' ? path = 'add-pickup-locations' : module[1] == 'update' ? path = 'update-pickup-locations' : path = 'pickup-locations'
        break
      case 'payment-settings':
        module[0] == 'payment-settings' ? path = 'payment-settings' : null
        break
      case 'cart-settings':
        module[0] == 'cart-settings' ? path = 'cart-settings' : null
        break
      case 'app-keys':
        module[0] == 'app-keys' ? path = 'app-keys' : null
        break
      case 'designs':
        module[0] == 'designs' ? path = 'designs' : null
        break
      case 'internationalization':
        module[0] == 'internationalization' ? path = 'internationalization' : null
        break
      case 'toasts':
        module[0] == 'toasts' ? path = 'toasts' : null
        break
      case 'sms-settings':
        module[0] == 'sms-settings' ? path = 'sms-settings' : null
        break
      case 'timer-settings':
        module[0] == 'timer-settings' ? path = 'timer-settings' : null
        break
      case 'auth-settings':
        module[0] == 'auth-settings' ? path = 'auth-settings' : null
        break
      case 'seo-details':
        module[0] == 'seo-details' ? path = 'seo-details' : null
        break
      case 'gift-wrap':
        module[0] == 'gift-wrap' ? path = 'gift-wrap' : null
        break
      case 'banner-images':
        module[0] == 'banner-images' ? path = 'banner-images' : null
        break
      case 'monthly-comparison':
        module[0] == 'monthly-comparison' ? path = 'monthly-comparison' : null
        break
      case 'activity-logs':
        module[0] == 'activity-logs' ? path = 'activity-logs' : null
        break
      case 'reviews':
        module[0] == 'reviews' ? path = 'reviews' : null
        break
      case 'user-alerts':
        module[0] == 'user-alerts' ? path = 'user-alerts' : null
        break
      case 'cart':
        module[0] == 'cart' ? path = 'cart' : null
        break
      case 'enquiries':
        module[0] == 'enquiries' ? path = 'enquiries' : null
        break
      case 'wishlist':
        module[0] == 'wishlist' ? path = 'wishlist' : null
        break
      case 'dynamic-scripts':
        module[0] == 'dynamic-scripts' ? path = 'dynamic-scripts' : null
        break
      case 'analytics':
        module[0] == 'analytics' ? path = 'analytics' : null
        break
      case 'mobile-apps':
        module[0] == 'mobile-apps' ? path = 'mobile-apps' : null
        break
      case 'page-covers':
        module[0] == 'page-covers' ? path = 'page-covers' : null
        break
      case 'shipping-policy':
        module[0] == 'shipping-policy' ? path = 'shipping-policy' : null
        break
      case 'shipping-charges':
        module[0] == 'shipping-charges' ? path = 'shipping-charges' : null
        break
      case 'shipping-rules':
        module[0] == 'shipping-rules' ? path = 'shipping-rules' : null
        break
      case 'shipping-settings':
        module[0] == 'shipping-settings' ? path = 'shipping-settings' : null
        break
      case 'refund-policy':
        module[0] == 'refund-policy' ? path = 'refund-policy' : null
        break
      case 'privacy-policy':
        module[0] == 'privacy-policy' ? path = 'privacy-policy' : null
        break
      case 'terms-and-conditions':
        module[0] == 'terms-and-conditions' ? path = 'terms-and-conditions' : null
        break
      case 'payment-policy':
        module[0] == 'payment-policy' ? path = 'payment-policy' : null
        break
      case 'service-warranty':
        module[0] == 'service-warranty' ? path = 'service-warranty' : null
        break
      case 'navigation':
        module[0] == 'navigation' ? path = 'navigation' : null
        break
      case 'bulk-upload':
        module[0] == 'bulk-upload' ? path = 'bulk-upload' : null
        break
      case 'faq':
        module[1] == 'add' ? path = 'add-faq' : module[1] == 'update' ? path = 'update-faq' : path = 'faq'
        break
      case 'tax-rules':
        module[1] == 'add' ? path = 'add-tax-rules' : module[1] == 'update' ? path = 'update-tax-rules' : path = 'tax-rules'
        break
      case 'tax-classes':
        module[1] == 'add' ? path = 'add-tax-classes' : module[1] == 'update' ? path = 'update-tax-classes' : path = 'tax-classes'
        break
      case 'reports':
        module[0] == 'reports' ? path = 'reports' : null
        break
      case 'invoice-settings':
        module[0] == 'invoice-settings' ? path = 'invoice-settings' : null
        break
      case 'store-popup':
        module[0] == 'store-popup' ? path = 'store-popup' : null
        break
    }

    return this.authService.authorizeUser(path).pipe(
      map((res: any) => {
        if (res?.errorCode === 0) {
          const isAccessDenied: boolean = res?.result?.isAccessDenied || false;
          if (isAccessDenied) {
            return this.router.parseUrl('/access-denied');
          } else {
            return true;
          }
        } else {
          return false;
        }
      })
    );
  }
}
