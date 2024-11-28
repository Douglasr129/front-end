import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, CanDeactivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageUtils } from '../../utils/localstorage';
import { NovoComponent } from '../novo/novo.component';
@Injectable()
export class FornecedorGuard implements CanActivate, CanDeactivate<NovoComponent> {
  localStorageUtils = new LocalStorageUtils
  ();
  constructor(private router:Router) {}
  canDeactivate(component: NovoComponent ): MaybeAsync<GuardResult> {
    if(component.mudancasNaoSalvas){
      return window.confirm("Tem certeza que deseja abandonar o preenchimento do formulario?")
    }
    return true
  }
  canActivate(routeAc: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (!this.localStorageUtils.obterTokenUsuario()) {
      this.router.navigate(['/account/sign-in']);
      return false;
    }
  
    let user = this.localStorageUtils.obterUsuario();
    let claimData: any = routeAc.data[0];
  
    if (claimData !== undefined) {
      let claim = claimData['claim'];
      if (claim) {
        if (!user.claims) {
          this.navgaterACessoNegado();
          return false;
        }
  
        // Encontrar todas as claims correspondentes
        let userClaims = user.claims.filter((x: any) => x.type === claim.nome);
  
        // Verificar se há claims correspondentes
        if (userClaims.length === 0) {
          this.navgaterACessoNegado();
          return false;
        }
  
        // Verificar cada claim encontrada
        let match = userClaims.some((userClaim: any) => {
          let valoresClaim = userClaim.value as string;
          return valoresClaim.includes(claim.valor);
        });
  
        if (!match) {
          this.navgaterACessoNegado();
          return false;
        }
      }
    }
  
    return true;
  }
  
  navgaterACessoNegado(){
    this.router.navigate(['/access-refused'])
  }
}