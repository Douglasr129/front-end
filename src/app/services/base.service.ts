import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { LocalStorageUtils } from '../utils/localstorage';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  public LocalStorage = new LocalStorageUtils();
  protected UrlServiceV1: String = environment.apiUrlv1;
  protected GettingHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  }
  protected GettingAuthHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.LocalStorage.obterTokenUsuario()}`
      })
    };
  }
  protected extractData(response: any) {
    return response.data || response
  }
  protected serviceError(response: Response | any) {
    let customError: string[] = [];
    let customResponse: CustomResponse = { error: { errors: [] }}

    if (response instanceof HttpErrorResponse) {
      if (response.statusText === "Unknown Error") {
        customError.push("Ocorreu um erro desconhecido")
        response.error.errors = customError;
      }
      if (response.status === 500) { 
        customError.push('Ocorreu um erro no processamento, tente novamente mais tarde ou contate o nosso suporte.'); 
        customResponse.error.errors = customError; 
        return throwError(() => customResponse); }
    }

    console.error(response);
    return throwError(() => response);
  }
  constructor() { }
}
interface CustomResponse { error: { errors: string[]; }; }