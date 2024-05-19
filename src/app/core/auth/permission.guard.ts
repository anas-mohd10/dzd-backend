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
