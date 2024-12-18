import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss',
  providers:[]
})
export class ListaComponent {
  imagens: string = environment.imagensUrl;
  produtos: Produto[] = [];
  errorMessage: string = "";

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.produtoService.obterTodos()
      .subscribe({
        next: produto => this.produtos = produto,
        error: () => this.errorMessage
      });
  }
}
