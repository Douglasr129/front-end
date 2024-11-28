import { Component } from '@angular/core';
import { FornecedorService } from '../services/fornecedor.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Fornecedor } from '../models/fornecedor';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-excluir',
  standalone: true,
  imports: [RouterLink, NgxMaskPipe],
  templateUrl: './excluir.component.html',
  styleUrl: './excluir.component.scss',
  providers:[NgxMaskDirective]
})
export class ExcluirComponent {
  fornecedor: Fornecedor | any;
  enderecoMap;
  errors: any[] = [];
  constructor(
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer) {

    this.fornecedor = this.route.snapshot.data['fornecedor'];
    this.enderecoMap = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?q=" + this.EnderecoCompleto() + "&key=AIzaSyAP0WKpL7uTRHGKWyakgQXbW6FUhrrA5pE");
  }
  public EnderecoCompleto(): string {
    return this.fornecedor.endereco.logradouro + ", " + this.fornecedor.endereco.numero + " - " + this.fornecedor.endereco.bairro + ", " + this.fornecedor.endereco.cidade + " - " + this.fornecedor.endereco.estado;
  }
  excluirEvento() {
    this.fornecedorService.excluirFornecedor(this.fornecedor.id)
      .subscribe({
        next: (fornecedor) => { this.sucessoExclusao(fornecedor) },
        error: (error) => { this.falha(error) }
      });
  }
  sucessoExclusao(evento: any) {
    this.toastr.success('Fornecedor excluido com Sucesso!', 'Good bye :D');
    this.router.navigate(['/fornecedores/listar-todos']);
  }
  falha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(');
  }
}
