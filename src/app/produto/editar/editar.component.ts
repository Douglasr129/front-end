import { Component, ElementRef, TemplateRef, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoService } from '../services/produto.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { cnpjValidator, cpfValidator, DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { StringUtils } from '../../utils/string-utils';
import { CommonModule } from '@angular/common';
import { fromEvent, merge, Observable } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxSpinner, NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner'
import { Fornecedor, Produto } from '../models/produto';
import { CurrencyUtils } from '../../utils/currency-utils';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxMaskDirective, NgxSpinnerComponent],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss',
  providers: [provideNgxMask(),NgxSpinnerService]
})
export class EditarComponent {
  imagens: string = environment.imagensUrl;

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[] | any;

  imageBase64: any;
  imagemPreview: any;
  imagemNome: string | any;
  imagemOriginalSrc: string | any;

  mudancasNaoSalvas?: boolean;
  produtoForm: FormGroup | any;
  errors: [] = [];
  produto: Produto | any;
  fornecedores: Fornecedor | any

  validationMessages: ValidationMessages | any;
  genericValidator: GenericValidator | any;
  displayMessage: DisplayMessage | any;

  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {


    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
        minLength:'Nome deve conter entre 2 e 200 caracteres',
        maxLength:'Nome deve conter entre 2 e 200 caracteres'
      },
      descricao: {
        required: 'Informe o Nome',
        minLength:'Descricao deve conter entre 2 e 1000 caracteres',
        maxLength:'Descricao deve conter entre 2 e 1000 caracteres'
      },
      imagem: {
        required: 'Informe a imagem'
      },
      valor: {
        required: 'Informe o valor'
      },

    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    
    this.produto = this.route.snapshot.data['produto'];
  }

  

  ngOnInit(): void {

    this.produtoService.obterFornecedores()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores);

    this.produtoForm = this.fb.group({
      fornecedorId: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      imagem: [''],
      valor: ['', [Validators.required]],
      ativo: [0]
    });

    this.produtoForm.patchValue({
      fornecedorId: this.produto.fornecedorId,
      id: this.produto.id,
      nome: this.produto.nome,
      descricao: this.produto.descricao,
      ativo: this.produto.ativo,
      valor: CurrencyUtils.DecimalParaString(this.produto.valor)
    });

    // utilizar o [src] na imagem para evitar que se perca após post
    this.imagemOriginalSrc = this.imagens + this.produto.imagem;
  }

  ngAfterViewInit(): void {
    this.configurarElementosValidacao()
  }
  configurarElementosValidacao() {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.validarFormulario();
    });
  }
  validarFormulario() {
    this.displayMessage = this.genericValidator.processarMensagens(this.produtoForm);
    this.mudancasNaoSalvas = true;
  }

  editarProduto() {
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);

      if (this.imageBase64) {
        this.produto.imagemUpload = this.imageBase64;
        this.produto.imagem = this.imagemNome;
      }

      this.produto.valor = CurrencyUtils.StringParaDecimal(this.produto.valor);

      this.produtoService.atualizarProduto(this.produto)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.produtoForm.reset();
    this.errors = [];

    let toast = this.toastr.success('Produto editado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  upload(file: any) {
    this.imagemNome = file[0].name;

    var reader = new FileReader();
    reader.onload = this.manipularReader.bind(this);
    reader.readAsBinaryString(file[0]);
  }

  manipularReader(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.imageBase64 = btoa(binaryString);
    this.imagemPreview = "data:image/jpeg;base64," + this.imageBase64;
  }
}
