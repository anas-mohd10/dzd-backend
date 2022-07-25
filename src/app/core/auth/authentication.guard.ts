import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { localstorageVariables } from 'src/app/config/localStorageVariable';
import { authRoute } from 'src/app/config/routes/auth.routes';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(public router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem(localstorageVariables.is_logged_in) == 'true') {
      return true;
    }
    this.router.navigate([authRoute.LOGIN], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
