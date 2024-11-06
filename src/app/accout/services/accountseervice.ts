import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../../account/models/user";

@Injectable()
export class AccountService {

    constructor(private http: HttpClient) {}

    signIn(user:User){}

    signUp(user:User){}
    
}
