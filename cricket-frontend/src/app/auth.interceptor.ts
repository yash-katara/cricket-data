import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthserviceService } from './authservice.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router :Router, private authService:AuthserviceService) {}

intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = localStorage.getItem('token');
  if (token) {
    request = request.clone({
      setHeaders: { 
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || '';

        if (error.status === 401 || error.status === 403) {
          if (
            errorMessage.includes('Token is invalid') ||
            errorMessage.includes('Token has expired')
          ) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        }

        return throwError(() => error);
      })
    );
  }
}
