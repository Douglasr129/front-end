import { Component, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayMessage, passwordStrength } from '../../utils/generic-form-validation';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  providers: [AccountService,
    provideAnimations()
  ]
})
export class SignInComponent {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[] | undefined;

  errors: any[] = [];
  loginForm: FormGroup | any;
  usuario: User | any;

  returnUrl: string | any;
  validationMessages: { email: { required: string; email: string; }; password: { required: string; rangeLength: string; }; };
  displayMessage: DisplayMessage | any;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      }
    };
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrength(6, 15)]]
    });
  }

  ngAfterViewInit(): void { }

  login() {
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.usuario = Object.assign({}, this.usuario, this.loginForm.value);
      this.accountService.signIn(this.usuario)
        .subscribe(
          {
            next: (success) => this.processSuccess(success),
            error: (fail) => this.processFail(fail)
          }
        );
    }
  }

  processSuccess(response: any) {
    this.loginForm.reset();
    this.errors = [];

    this.accountService.LocalStorage.salvarDadosLocaisUsuario(response);
    this.toastr.success('Login realizado com Sucesso!', 'Bem vindo!!!');
    this.router.navigate(['/home']);
  }

  processFail(fail: any) {
    this.errors = fail.error.errors;
  }
}
