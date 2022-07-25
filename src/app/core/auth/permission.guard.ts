// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { localstorageVariables } from 'src/app/config/localStorageVariable';
// import { authRoute } from 'src/app/config/routes/auth.routes';

// @Injectable({
//   providedIn: 'root'
// })
// export class PermissionGuard implements CanLoad {
//   constructor(public router: Router) {
//   }
//   // canLoad(route: Route, segments: UrlSegment[]): boolean {
//   //   if (localStorage.getItem(localstorageVariables.is_logged_in) == 'true') {
//   //     return true;
//   //   }
//   //   this.router.navigate([authRoute.LOGIN], { queryParams: { returnUrl: segments } });
//   //   return false;
//   // }
// }
