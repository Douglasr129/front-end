import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageUtils } from '../utils/localstorage';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  localStorageUtil = new LocalStorageUtils();

  constructor(private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.localStorageUtil.limparDadosLocaisUsuario();
            this.router.navigate(['/account/sign-in'], { queryParams: { returnUrl: this.router.url } });
          }
          if (error.status === 403) {
            this.localStorageUtil.limparDadosLocaisUsuario();
            this.router.navigate(['/access-refused'])
          }
        }
        return throwError(() => error);
      })
    )
  }

}
