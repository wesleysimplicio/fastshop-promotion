import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CONSTANTS } from '../helpers/constants';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class JwtIntercerptorService implements HttpInterceptor {

  constructor(private alertService: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        tap((event: HttpResponse<any>) => {
          if (event instanceof HttpResponse) {
            return event;
          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }
  responseError(error: HttpErrorResponse) {
    if (error.error.errors !== undefined) {
      error.error.errors.forEach(e => {
        this.alertService.clear();
        this.alertService.error(e.defaultMessage)
      });
    } else {
      if (error.status === 0) {
        this.alertService.clear();
        this.alertService.warning(CONSTANTS.MESSAGE.NO_SERVICE);
      } else {
        if (error.status === 404) {
          this.alertService.clear();
          this.alertService.info(error.error.message);
        } else {
          this.alertService.clear();
          this.alertService.error(error.error.message);
        }
      }
    }
  }
}