import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { appRoutes } from 'src/app/config/routes';
import { authRoute } from 'src/app/config/routes/auth.routes';
import { AuthService } from 'src/app/includes/services/auth.service';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-5 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  private unsubscribe: Subscription[] = [];
  userData: any;
  authRoute = authRoute;
  appRoute = appRoutes

  constructor(
    public router: Router, private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.getCurrentUser();
  }

  logout() {
    localStorage.removeItem('LoginData');
    this.authService.logout()
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
