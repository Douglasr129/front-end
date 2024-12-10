import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { provideNgxMask } from 'ngx-mask';
import { ProdutoService } from '../services/produto.service';
import { CurrencyUtils } from '../../utils/currency-utils';
import { ImageCropperComponent, ImageCroppedEvent, Dimensions, ImageTransform } from 'ngx-image-cropper';
import { ProdutoBaseComponent } from '../produto-form.base.component';

@Component({
  selector: 'app-novo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageCropperComponent],
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.scss'],
  providers: [provideNgxMask()]
})
export class NovoComponent extends ProdutoBaseComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  imageChangedEvent: any = '';
  croppedImage: any = '';
  ImageBase64: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imagemNome: any;

  constructor(private fb: FormBuilder,
              private produtoService: ProdutoService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) {
    super();
    this.produto = this.route.snapshot.data['produto'];
  }

  ngOnInit(): void {
    this.produtoService.obterFornecedores()
      .subscribe(fornecedores => this.fornecedores = fornecedores);

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
    console.log(this.formInputElements);
    super.configurarValidacaoFormulario(this.formInputElements);
  }

  adicionarProduto() {
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);
      this.produto.imagemUpload = this.croppedImage.split(',')[1];
      this.produto.imagem = this.imagemNome;
      this.produto.valor = CurrencyUtils.StringParaDecimal(this.produto.valor);

      this.produtoService.novoProduto(this.produto)
        .subscribe({
          next: (sucesso: any) => { this.processarSucesso(sucesso); },
          error: (falha: any) => { this.processarFalha(falha); }
        });
    }
  }

  processarSucesso(response: any) {
    this.produtoForm.reset();
    this.errors = [];
    this.toastr.success('Produto cadastrado com sucesso!', 'Sucesso!');
    this.router.navigate(['/produtos/listar-todos']);
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imagemNome = event.currentTarget.files[0].name;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) { }

  loadImageFailed() {
    this.errors.push(`O formato do arquivo ${this.imagemNome} não é aceito.`);
  }
}
