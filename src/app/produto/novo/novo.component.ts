import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ProdutoService } from '../services/produto.service';
import { Fornecedor, Produto } from '../models/produto';
import { CurrencyUtils } from '../../utils/currency-utils';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { fromEvent, merge, Observable } from 'rxjs';

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

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  fornecedores: Fornecedor[] | any;
  produtoForm: FormGroup | any;
  produto: Produto | any;
  imagemNome: any;
  errors: any[] = [];

  validationMessages: ValidationMessages | any;
  genericValidator: GenericValidator | any;
  displayMessage: DisplayMessage | any;

  mudancasNaoSalvas?: boolean;


  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
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
  }

  ngOnInit(): void {

    this.produtoService.obterFornecedores()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores);

    this.produtoForm = this.fb.group({
      fornecedorId: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      imagem: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      ativo: [true]
    });
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

  adicionarProduto() {
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);

      this.produto.imagemUpload = this.croppedImage.split(',')[1];
      this.produto.imagem = this.imagemNome;
      this.produto.valor = CurrencyUtils.StringParaDecimal(this.produto.valor);

      this.produtoService.novoProduto(this.produto)
        .subscribe({
          next: (sucesso: any) => { this.processarSucesso(sucesso) },
          error: (falha: any) => { this.processarFalha(falha) }
        });
    }
  }

  processarSucesso(response: any) {
    this.produtoForm.reset();
    this.errors = [];
    
    let toast = this.toastr.success('Produto cadastrado com sucesso!', 'Sucesso!');
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imagemNome = event.currentTarget.files[0].name;
  }
  imageCropped(event: any) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.showCropper = true;
  }
  cropperReady(sourceImageDimensions: any) {
    console.log('Cropper ready', sourceImageDimensions);
  }
  loadImageFailed() {
    
  }
}
