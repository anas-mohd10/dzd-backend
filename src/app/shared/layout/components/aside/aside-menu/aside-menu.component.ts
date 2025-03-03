import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { appRoutes } from 'src/app/config/routes';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})

export class AsideMenuComponent implements OnInit {
  appRoute = appRoutes;
  modalRef?: BsModalRef;
  @ViewChild('logoutModal') logoutModal!: TemplateRef<any>;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private modalService: BsModalService
  ) { }

  rootUrl = "https://localhost:3000/api/v1/w/admin/auth";

  ngOnInit(): void { }

  getRoles() {
    this.http.get(this.rootUrl + "/roles").subscribe((_res) => {
      return _res
    })
  }

  // Update the logout click handler to show modal
  logout() {
    this.modalRef = this.modalService.show(this.logoutModal, {
      class: 'modal-dialog-centered'
    });
  }

  // Confirm logout
  confirmLogout() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('UserData');
    localStorage.removeItem('is_logged_in');
    this.modalRef?.hide();
    this.router.navigate(['/auth/login']);
  }

  // Decline logout
  declineLogout() {
    this.modalRef?.hide();
  }

  getPermissions() {
    this.http.get(this.rootUrl + "/permissions").subscribe((_res) => {
      return _res
    })
  }
}
