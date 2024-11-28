import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';
import { DisplayMessage, GenericValidator, cpfValidator, ValidationMessages, cnpjValidator } from '../../utils/generic-form-validation';
import { CommonModule } from '@angular/common';
import { fromEvent, merge, Observable } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { StringUtils } from '../../utils/string-utils';
import { CepConsulta } from '../models/endereco';

@Component({
  selector: 'app-novo',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './novo.component.html',
  styleUrl: './novo.component.scss',
  providers: [provideNgxMask()]
})
export class NovoComponent implements OnInit, AfterViewInit {
 

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[] | any;

  errors: any[] = [];
  fornecedorForm: FormGroup | any;
  fornecedor?: Fornecedor;
  validationMessages: ValidationMessages | any;
  genericValidator: GenericValidator | any;
  displayMessage: DisplayMessage | any;

  mudancasNaoSalvas?: boolean;


  textoDocumento: string = 'CPF (requerido)';
  formResult: string = '';

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService) {


    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      documento: {
        required: 'Informe o Documento',
        cpf: 'CPF em formato inválido',
        cnpj: 'CNPJ em formato inválido'
      },
      logradouro: {
        required: 'Informe o Logradouro',
      },
      numero: {
        required: 'Informe o Número',
      },
      bairro: {
        required: 'Informe o Bairro',
      },
      cep: {
        required: 'Informe o CEP',
        cep: 'CEP em formato inválido'
      },
      cidade: {
        required: 'Informe a Cidade',
      },
      estado: {
        required: 'Informe o Estado',
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {

    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],

      endereco: this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]]
      })
    });

    this.fornecedorForm.patchValue({ tipoFornecedor: '1', ativo: true });
  }
  ngAfterViewInit(): void {
    this.tipoFornecedorForm().valueChanges
      .subscribe(()=>{
        this.trocarValidacaoDocumento();
        this.configurarElementosValidacao();
        this.validarFormulario();
      })
    this.configurarElementosValidacao();
  }
  configurarElementosValidacao() {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.validarFormulario();
    });
  }
  validarFormulario() {
    this.displayMessage = this.genericValidator.processarMensagens(this.fornecedorForm);
    this.mudancasNaoSalvas = true;
  }
  trocarValidacaoDocumento() {
    if (this.tipoFornecedorForm().value === "1") {
      this.documento().clearValidators();
      this.documento().setValidators([Validators.required,cpfValidator()])
      this.textoDocumento = "CPF (requerido)"
    } else {
      this.documento().clearValidators();
      this.documento().setValidators([Validators.required,cnpjValidator()])
      this.textoDocumento = "CNPJ (requerido)"
      
    }
  }
  tipoFornecedorForm() {
    return this.fornecedorForm.get('tipoFornecedor');
  }
  documento() {
    return this.fornecedorForm.get('documento');
  }

  buscarCep(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let cep = inputElement?.value
    cep = StringUtils.somenteNumeros(cep);
    if (cep.length < 8) return;

    this.fornecedorService.consultarCep(cep)
      .subscribe({
        next: cepRetorno => this.preencherEnderecoConsulta(cepRetorno),
        error: erro => this.errors.push(erro)
      })       
  }
  preencherEnderecoConsulta(cepConsulta: CepConsulta) {

    this.fornecedorForm.patchValue({
      endereco: {
        logradouro: cepConsulta.logradouro,
        bairro: cepConsulta.bairro,
        cep: cepConsulta.cep,
        cidade: cepConsulta.localidade,
        estado: cepConsulta.uf
      }
    });
  }
  adicionarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {

      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
      this.formResult = JSON.stringify(this.fornecedor);

      this.fornecedor!.endereco!.cep = StringUtils.somenteNumeros(this.fornecedor!.endereco!.cep!);
      this.fornecedor!.documento = StringUtils.somenteNumeros(this.fornecedor!.documento!);
      // forçando o tipo fornecedor ser serializado como INT
      this.fornecedor!.tipoFornecedor = parseInt(this.fornecedor!.tipoFornecedor!.toString());

      this.fornecedorService.novoFornecedor(this.fornecedor!)
        .subscribe({ 
          next: (success) => this.processarSucesso(success), 
          error: err => this.processarFalha(err)
      }
        );
    }
  }
  processarSucesso(response: any) {
    this.fornecedorForm.reset();
    this.errors = [];

    this.mudancasNaoSalvas = false;

    let toast = this.toastr.success('Fornecedor cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }
}
