import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { emailGatewaysEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class EmailGatewaysService {

    constructor(
        private http: HttpClient,
        private commonService: CommonService
    ) { }

    manage(data: any) {
        const url = this.commonService.getFullUrl(emailGatewaysEndpoints.manage);
        return this.http.post(`${url}`, data);
    }

    getGatewayDetails(gatewayId: string) {
        const url = this.commonService.getFullUrl(emailGatewaysEndpoints.get + `/${gatewayId}`);
        return this.http.get(`${url}`);
    }

    getGateways() {
        const url = this.commonService.getFullUrl(emailGatewaysEndpoints.fetch);
        return this.http.get(`${url}`);
    }
}
