import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { LocalStorageUtils } from '../utils/localstorage';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  public LocalStorage =new LocalStorageUtils();
  protected UrlServiceV1: String = environment.apiUrlv1;
  protected GettingHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  }
  protected extractData(response: any) {
    return response.data || {}
  }
  protected serviceError(response: Response | any) {
    let customError: string[] = [];

    if (response instanceof HttpErrorResponse) {
      if (response.statusText === "Unknown Error") {
        customError.push("Ocorreu um erro desconhecido")
        response.error.errors = customError;
      }
    }
    return throwError(() => response);
  }
  constructor() { }
}
