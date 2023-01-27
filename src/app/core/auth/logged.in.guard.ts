import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { localstorageVariables } from 'src/app/config/localStorageVariable';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { authRoute } from 'src/app/config/routes/auth.routes';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  appRoute = appRoutes;
  constructor(private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (localStorage.getItem(localstorageVariables.is_logged_in)) {
      this.router.navigate([appRoutes.DASHBOARD]);
      return false;
    }
    return true
  }
}
