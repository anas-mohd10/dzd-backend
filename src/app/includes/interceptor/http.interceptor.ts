import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { localstorageVariables } from 'src/app/config/localStorageVariable';

@Injectable()
export class HttpInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let bearerToken = ''
    let token = localStorage.getItem(localstorageVariables.access_token)
    if (token) bearerToken = token;
    let timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone; //Get the timezone

    request = request.clone({
      withCredentials: false,
      setHeaders: {
        Timezone: timezone,
        Authorization: `Bearer ${token}`,
      }
    });
    return next.handle(request)
  }
}
