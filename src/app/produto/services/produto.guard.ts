import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { NovoComponent } from '../novo/novo.component';
import { BaseGuard } from '../../services/base.guard';

@Injectable()
export class ProdutoGuard extends BaseGuard implements CanActivate, CanDeactivate<NovoComponent> {
  constructor(protected override router:Router) { super(router);}
  canDeactivate(component: NovoComponent ): MaybeAsync<GuardResult> {
    if(component.mudancasNaoSalvas){
      return window.confirm("Tem certeza que deseja abandonar o preenchimento do formulario?")
    }
    return true
  }
  canActivate(routeAc: ActivatedRouteSnapshot): MaybeAsync<GuardResult> {
    return super.validarClaims(routeAc);
  }
}