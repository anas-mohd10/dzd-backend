import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { authEndpoints } from '../../config/endpoints';
import { authRoute } from '../../config/routes';
import { Router } from '@angular/router';
import { localstorageVariables } from 'src/app/config/localStorageVariable';
import { adminUsersEndpoints } from 'src/app/config/endpoints/admin.users.endpoints';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    authEndpoints = authEndpoints;
    adminUsersEndpoints = adminUsersEndpoints
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
        const userJSON = localStorage.getItem(localstorageVariables.userData)
        return this.currentUserValue = userJSON !== null ? JSON.parse(userJSON) : ''
    }

    saveUserData(data: any) {
        const { permissions, token, id, ...userData } = data
        localStorage.setItem(localstorageVariables.userData, JSON.stringify(userData))
    }

    authorizeUser(data: any) {
        const url = this.commonService.getFullUrl(this.adminUsersEndpoints.authorize + `?type=${data}`);
        return this.http.get(url);
    }
}