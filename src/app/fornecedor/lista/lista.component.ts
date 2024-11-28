import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [RouterLink,NgxMaskPipe],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss',
  providers:[NgxMaskDirective]
})
export class ListaComponent {
  public fornecedores: Fornecedor[] = [];
  errorMessage: string = "";

  constructor(private fornecedorService: FornecedorService) { }

  ngOnInit(): void {
    this.fornecedorService.obterTodos()
      .subscribe({
        next: fornecedores => this.fornecedores = fornecedores,
        error: () => this.errorMessage
      });
  }
}
