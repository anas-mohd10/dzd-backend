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
      case 'admin-users':
        module[1] == 'add' ? path = 'add-adminusers' : module[1] == 'update' ? path = 'update-adminusers' : path = 'admin-users'
        break
      case 'testimonials':
        module[1] == 'add' ? path = 'add-testimonials' : module[1] == 'update' ? path = 'update-testimonials' : path = 'testimonials'
        break
      case 'payment-settings':
        module[1] == 'payment-settings' ? path = 'payment-settings' : null
        break
      case 'media-library':
        module[1] == 'media-library' ? path = 'media-library' : null
        break
      case 'feeds':
        module[1] == 'feeds' ? path = 'feeds' : null
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
      case 'offers':
        module[1] == 'add' ? path = 'add-offers' : module[1] == 'update' ? path = 'update-offers' : path = 'offers'
        break
      case 'loyalty':
        module[1] == 'loyalty' ? path = 'loyalty' : null
        break
      case 'referral':
        module[0] == 'referral' ? path = 'referral' : null
        break
      case 'gift-wrap':
        module[0] == 'gift-wrap' ? path = 'gift-wrap' : null
        break
      case 'customers':
        module[1] == 'add' ? path = 'add-customers' : module[1] == 'update' ? path = 'update-customers' : path = 'customers'
        break
      case 'roles':
        module[1] == 'add' ? path = 'add-roles' : module[1] == 'update' ? path = 'update-roles' : path = 'roles'
        break
      case 'store-settings':
        module[0] == 'store-settings' ? path = 'store-settings' : null
        break
      case 'stores':
        module[1] == 'add' ? path = 'add-stores' : module[1] == 'update' ? path = 'update-stores' : path = 'stores'
        break
      case 'payment-settings':
        module[0] == 'payment-settings' ? path = 'payment-settings' : null
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
      case 'page-covers':
        module[0] == 'page-covers' ? path = 'page-covers' : null
        break
      case 'shipping-policy':
        module[0] == 'shipping-policy' ? path = 'shipping-policy' : null
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
