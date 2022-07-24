import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { authEndpoints } from '../../config/endpoints';
import { authRoute } from '../../config/routes';
import { Router } from '@angular/router';
import { localstorageVariables } from 'src/app/config/localStorageVariable';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authEndpoints = authEndpoints;
    authRoute = authRoute;
  isLoading$: any;
  currentUserValue: any;

    constructor(
        private http: HttpClient,
        private commonService: CommonService,
        private router: Router
    ) {
    }

    login(data: any) {
        const url = this.commonService.getFullUrl(this.authEndpoints.login);
        return this.http.post(url, data);
    }

    logout() {
        localStorage.clear();
        this.router.navigate([this.authRoute.LOGIN]);
    }


    getCurrentUser() {
        return JSON.parse(localStorage.getItem(localstorageVariables.userData))
    }

    saveUserData(data: any) {
        const { permissions, token, id, ...userData } = data
        localStorage.setItem(localstorageVariables.userData, JSON.stringify(userData))
    }
}