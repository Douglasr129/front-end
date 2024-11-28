import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router } from '@angular/router';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { LocalStorageUtils } from '../../utils/localstorage';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanDeactivate<SignUpComponent>, CanActivate {
localStirageUtils = new LocalStorageUtils();
constructor(private router: Router) { }
  canDeactivate(component: SignUpComponent) {
    if(component.mudancasNaoSalvas){
      return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulário?');
    }
    return true;
  }
  canActivate(){
    if (this.localStirageUtils.obterTokenUsuario()) {
      this.router.navigate(['/home']);
    }
    return true;
  }
}
