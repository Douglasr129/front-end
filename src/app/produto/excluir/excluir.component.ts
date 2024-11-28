import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-excluir',
  standalone: true,
  imports: [RouterLink, NgxMaskPipe],
  templateUrl: './excluir.component.html',
  styleUrl: './excluir.component.scss',
  providers:[NgxMaskDirective]
})
export class ExcluirComponent {
  imagens: string = '';
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

    const toast = this.toastr.success('Produto excluido com Sucesso!', 'Good bye :D');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }

  public falha() {
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(');
  }
}
