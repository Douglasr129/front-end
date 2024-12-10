import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-excluir',
  standalone: true,
  imports: [NgxMaskPipe],
  templateUrl: './excluir.component.html',
  styleUrl: './excluir.component.scss',
  providers:[NgxMaskDirective]
})
export class ExcluirComponent {
  imagens: string = environment.imagensUrl;
  produto: Produto | any;

  constructor(private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {

    this.produto = this.route.snapshot.data['produto'];
  }

  public excluirProduto() {
    this.produtoService.excluirProduto(this.produto.id)
      .subscribe({
        next: evento => { this.sucessoExclusao(evento) },
        error: ()     => { this.falha() }
      });
  }

  public sucessoExclusao(evento: any) {
    this.toastr.success('Produto excluido com Sucesso!', 'Good bye :D');
    this.router.navigate(['/produtos/listar-todos']);
  }

  public falha() {
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(');
  }
}
