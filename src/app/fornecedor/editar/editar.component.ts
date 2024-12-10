import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, TemplateRef, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fornecedor } from '../models/fornecedor';
import { CepConsulta, Endereco } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { cnpjValidator, cpfValidator, DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { StringUtils } from '../../utils/string-utils';
import { CommonModule } from '@angular/common';
import { fromEvent, merge, Observable } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxSpinner, NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner'
import { ProdutoComponent } from "../../produto/produto.component";
import { ListaProdutosComponent } from "../produtos/lista-produtos.component";

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxMaskDirective, NgxSpinnerComponent, ListaProdutosComponent],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss',
  providers: [provideNgxMask(),NgxSpinnerService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditarComponent {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[] | any;

  errors: any[] = [];
  fornecedorForm: FormGroup | any;
  fornecedor: Fornecedor | any;
  endereco: Endereco | any;
  validationMessages: ValidationMessages | any;
  genericValidator: GenericValidator | any;
  displayMessage: DisplayMessage | any;
  tipoFornecedor: number | any;
  enderecoForm:  FormGroup | any;textoDocumento: any;
  errorsEndereco: any[] = [];;
	closeResult = '';

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
    ) {

    config.backdrop = 'static';
    config.keyboard = false;

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
        cep: 'CEP em formato inválido',
      },
      cidade: {
        required: 'Informe a Cidade',
      },
      estado: {
        required: 'Informe o Estado',
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.fornecedor = this.route.snapshot.data['fornecedor'];
    this.tipoFornecedor = this.fornecedor?.tipoFornecedor;
  }

  ngOnInit() {

    this.spinner.show(); 

    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]]
    });

    this.enderecoForm = this.fb.group({
      id: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: ''
    });

    this.preencherForm();
    setTimeout(() => {
      this.spinner.hide(); 
    }, 1000);
  }

  preencherForm() {
    this.fornecedorForm.patchValue({
      id: this.fornecedor.id,
      nome: this.fornecedor.nome,
      ativo: this.fornecedor.ativo,
      tipoFornecedor: this.fornecedor.tipoFornecedor.toString(),
      documento: this.fornecedor.documento
    });

    if (this.tipoFornecedorForm().value === "1") {
      this.documento().setValidators([Validators.required]);
    }
    else {
      this.documento().setValidators([Validators.required]);
    }

    this.enderecoForm.patchValue({
      id: this.fornecedor.endereco.id,
      logradouro: this.fornecedor.endereco.logradouro,
      numero: this.fornecedor.endereco.numero,
      complemento: this.fornecedor.endereco.complemento,
      bairro: this.fornecedor.endereco.bairro,
      cep: this.fornecedor.endereco.cep,
      cidade: this.fornecedor.endereco.cidade,
      estado: this.fornecedor.endereco.estado
    });
  }

  ngAfterViewInit() {
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

  documento(): AbstractControl {
    return this.fornecedorForm.get('documento');
  }

  tipoFornecedorForm(): AbstractControl {
    return this.fornecedorForm.get('tipoFornecedor');
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

  editarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {
      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
      this.fornecedor!.documento = StringUtils.somenteNumeros(this.fornecedor!.documento!);
      this.fornecedor!.tipoFornecedor = parseInt(this.fornecedor!.tipoFornecedor!.toString());
      this.fornecedorService.atualizarFornecedor(this.fornecedor!)
        .subscribe({ 
          next: (success) => this.processarSucesso(success), 
          error: err => this.processarFalha(err)
      } );
    }
  }

  processarSucesso(response: any) {
    this.fornecedorForm.reset();
    this.errors = [];
    this.toastr.success('Fornecedor atualizado com sucesso!', 'Sucesso!');
    this.router.navigate(['/fornecedores/listar-todos']);
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  editarEndereco() {
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {

      this.endereco = Object.assign({}, this.endereco, this.enderecoForm.value);

      this.endereco.cep = StringUtils.somenteNumeros(this.endereco.cep);
      this.endereco.fornecedorId = this.fornecedor.id;

      this.fornecedorService.atualizarEndereco(this.endereco)
        .subscribe({
         next: () => this.processarSucessoEndereco(this.endereco),
         error: falha => { this.processarFalhaEndereco(falha) }
        });
    }
  }

  processarSucessoEndereco(endereco: Endereco) {
    this.errors = [];

    this.toastr.success('Endereço atualizado com sucesso!', 'Sucesso!');
    this.fornecedor.endereco = endereco
    this.modalService.dismissAll();
  }

  processarFalhaEndereco(fail: any) {
    this.errorsEndereco = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  abrirModal(content: any) {
    this.modalService.open(content);
  }


}
