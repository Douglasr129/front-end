import { Component, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoService } from '../services/produto.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { CommonModule } from '@angular/common';
import { fromEvent, merge, Observable } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner'
import { Fornecedor, Produto } from '../models/produto';
import { CurrencyUtils } from '../../utils/currency-utils';
import { environment } from '../../../environments/environment';
import { ProdutoBaseComponent } from '../produto-form.base.component';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxSpinnerComponent],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss',
  providers: [NgxSpinnerService]
})
export class EditarComponent extends ProdutoBaseComponent {
  imagens: string = environment.imagensUrl;

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[] | any;

  imageBase64: any;
  imagemPreview: any;
  imagemNome: string | any;
  imagemOriginalSrc: string | any;

  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {

    super();
    this.produto = this.route.snapshot.data['produto'];
  }



  ngOnInit(): void {
    this.spinner.show();
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

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.configurarMensagensValidacaoBase(this.produtoForm.valid)
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
        .subscribe({
          next: sucesso => { this.processarSucesso(sucesso) },
          error: falha => { this.processarFalha(falha) }
        });

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
    reader.readAsArrayBuffer(file[0]);
  }

  manipularReader(readerEvt: any) {
    var arrayBuffer = readerEvt.target.result;
    var binaryString = this.arrayBufferToBinaryString(arrayBuffer);
    this.imageBase64 = btoa(binaryString);
    this.imagemPreview = "data:image/jpeg;base64," + this.imageBase64;
  }
  arrayBufferToBinaryString(buffer: ArrayBuffer): string {
    var binary = ''; var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength; 
    for (var i = 0; i < len; i++) { 
      binary += String.fromCharCode(bytes[i]); 
    } 
    return binary;
  }
}
