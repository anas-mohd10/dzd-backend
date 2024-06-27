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
        module[1] == 'referral' ? path = 'referral' : null
        break
      case 'gift-wrap':
        module[1] == 'gift-wrap' ? path = 'gift-wrap' : null
        break
      case 'customers':
        module[1] == 'add' ? path = 'add-c' : module[1] == 'update' ? path = 'update-customers' : path = 'customers'
        break
    }

    return this.authService.authorizeUser(path).pipe(
      map((res: any) => {
        if (res?.errorCode === 0) {
          const isAccessDenied = res?.result?.isAccessDenied;
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
