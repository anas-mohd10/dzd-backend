import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { localstorageVariables } from 'src/app/config/localStorageVariable';

@Injectable()
export class HttpInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private toast: ToastService
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let bearerToken = ''
    let token = localStorage.getItem(localstorageVariables.access_token)
    if (token) {
      bearerToken = token;
    }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
    return next.handle(request)
  }
}
