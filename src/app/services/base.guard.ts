import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { LocalStorageUtils } from "../utils/localstorage";


export abstract class BaseGuard {
  private localStorageUtils = new LocalStorageUtils();

  constructor(protected router: Router) {}
  protected validarClaims(routeAc: ActivatedRouteSnapshot):boolean{

    if (!this.localStorageUtils.obterTokenUsuario()) {
      this.router.navigate(['/account/sign-in'], { queryParams: { returnUrl: this.router.url } });
    }
  
    let user = this.localStorageUtils.obterUsuario();
    let claimData: any = routeAc.data[0];
  
    if (claimData !== undefined) {
      let claim = claimData['claim'];
      if (claim) {
        if (!user.claims) {
          this.navgaterACessoNegado();
        }
  
        // Encontrar todas as claims correspondentes
        let userClaims = user.claims.filter((x: any) => x.type === claim.nome);
  
        // Verificar se há claims correspondentes
        if (userClaims.length === 0) {
          this.navgaterACessoNegado();
        }
  
        // Verificar cada claim encontrada
        let match = userClaims.some((userClaim: any) => {
          let valoresClaim = userClaim.value as string;
          return valoresClaim.includes(claim.valor);
        });
  
        if (!match) {
          this.navgaterACessoNegado();
        }
      }
    }
  
    return true;
  }

  private navgaterACessoNegado(){
    this.router.navigate(['/access-refused'])
  }
}

