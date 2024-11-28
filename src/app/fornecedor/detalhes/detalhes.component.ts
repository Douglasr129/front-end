import { Component } from '@angular/core';
import { Fornecedor } from '../models/fornecedor';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [RouterLink, NgxMaskPipe],
  templateUrl: './detalhes.component.html',
  styleUrl: './detalhes.component.scss',
  providers:[NgxMaskDirective]
})
export class DetalhesComponent {
  fornecedor: Fornecedor | any;
  enderecoMap;
 
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer) {
      this.fornecedor = this.route.snapshot.data['fornecedor'];
      console.log(this.EnderecoCompleto());
      this.enderecoMap = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?q=" + this.EnderecoCompleto() + "&key=AIzaSyAP0WKpL7uTRHGKWyakgQXbW6FUhrrA5pE");
  }

  public EnderecoCompleto(): string {
    return this.fornecedor?.['endereco']?.['logradouro'] + ", " + 
    this.fornecedor?.['endereco']?.['numero'] + " - " + 
    this.fornecedor?.['endereco']?.['bairro'] + ", " + 
    this.fornecedor?.['endereco']?.['cidade'] + " - " + 
    this.fornecedor?.['endereco']?.['estado'];
  }
}
