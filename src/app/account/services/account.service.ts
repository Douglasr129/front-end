import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { catchError, map, Observable } from "rxjs";
import { BaseService } from "../../services/base.service";

@Injectable()
export class AccountService extends BaseService {

    constructor(private http: HttpClient) { super(); }

    signIn(user: User): Observable<User> {
        let response = this.http
        .post<User>(this.UrlServiceV1 + 'entrar', user, this.GettingHeaderJson());
        return response;

    }

    signUp(user: User): Observable<User> {
        let response = this.http
            .post<User>(this.UrlServiceV1 + 'nova-conta', user, this.GettingHeaderJson());
        return response;
    }

}
