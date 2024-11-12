import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageUtils } from '../../utils/localstorage';

@Component({
  selector: 'app-menu-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu-login.component.html',
  styleUrl: './menu-login.component.scss'
})
export class MenuLoginComponent {
  localStorageUtils = new LocalStorageUtils();
  token: string = "";
  user: any;
  email: string = "";
  constructor(private router: Router) { }
  
  logout() {
    this.localStorageUtils.limparDadosLocaisUsuario();
    this.router.navigate(['/home']);
  }
  usuarioLogado(): boolean {
    this.token = this.localStorageUtils.obterTokenUsuario();
    this.user = this.localStorageUtils.obterUsuario();

    if (this.user)
      this.email = this.user.email;
    return this.token !== "";
  }

}
