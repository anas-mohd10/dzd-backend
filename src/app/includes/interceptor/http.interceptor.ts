import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor as NgHttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { localstorageVariables } from 'src/app/config/localStorageVariable';

@Injectable()
export class HttpInterceptor implements NgHttpInterceptor {

  constructor(private authService: AuthService) { }

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
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }
}
