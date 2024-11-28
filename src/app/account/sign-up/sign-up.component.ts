import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { fromEvent, merge, Observable } from 'rxjs';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account.service';
import { DisplayMessage, GenericValidator, matchPassword, passwordStrength, ValidationMessages } from '../../utils/generic-form-validation';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  providers: [AccountService],
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, AfterViewInit {

  errors: any[] = [];
  signUpForm: FormGroup;
  user?: User;

  validationMessages: ValidationMessages | any;
  genericValidator: GenericValidator | any;
  displayMessage: DisplayMessage | any;

  mudancasNaoSalvas?: boolean;

  @ViewChildren('formInput') formInputElements!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private router:Router,
    private toastr: ToastrService
  ) {
    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'E-mail inválido',
      },
      password: {
        required: 'Informe a senha',
        passwordStrength: 'A senha deve ter entre 6 e 15 caracteres, conter pelo menos uma letra maiúscula e um caractere especial.'
      },
      confirmPassword: {
        required: 'Informe a senha novamente',
        matchPasswordValidator: 'As senhas não conferem',
        matchPassword:'As senhas não conferem'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    let senha = new FormControl('', [Validators.required, passwordStrength(6, 15)]);
    let senhaConfirm = new FormControl('', [Validators.required, passwordStrength(6, 15), matchPassword(senha)]);

    this.signUpForm = this.fb.group({ 
      email: this.fb.control('', [Validators.required, Validators.email]), 
      password: senha, 
      confirmPassword: senhaConfirm
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.signUpForm);
      this.mudancasNaoSalvas = true;
    });
  }

  addAccount() { 
    if (this.signUpForm.dirty && this.signUpForm.valid) { 
      this.user = Object.assign({}, this.user, this.signUpForm.value); 
      this.accountService.signUp(this.user!) 
        .subscribe({ 
          next: (success) => this.processSuccess(success), 
          error: err => this.processFail(err)
      }); 
      this.mudancasNaoSalvas = false;
    }
  }

  processSuccess (response: any){
    this.signUpForm.reset();
    this.errors = [];
    this.accountService.LocalStorage.salvarDadosLocaisUsuario(response);

    let toast = this.toastr.success('Registro realizado com Sucesso!', 'Bem vindo!!!');
    this.router.navigate(['/home']);
/*     if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/home']);
      });
    } */
  }
  processFail (fail: any){
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(')
  }

}
