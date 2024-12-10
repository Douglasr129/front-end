import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Produto } from '../../produto/models/produto';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lista-produtos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.scss'
})
export class ListaProdutosComponent implements OnInit {
  imagens: string = environment.imagensUrl;
  
  ngOnInit(): void {
    console.log(this.imagens);
  }
  @Input()
  produtos: Produto[] | any;
}
