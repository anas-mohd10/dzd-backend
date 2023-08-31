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
    let path = state.url.split('app/')[1];
    path = path.split('?')[0]
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
