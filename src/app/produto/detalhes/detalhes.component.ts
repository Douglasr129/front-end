import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Produto } from '../models/produto';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [RouterLink, NgxMaskPipe],
  templateUrl: './detalhes.component.html',
  styleUrl: './detalhes.component.scss',
  providers:[NgxMaskDirective]
})
export class DetalhesComponent {
  imagens: string = environment.imagensUrl;
  produto: Produto | any;

  constructor(private route: ActivatedRoute) {

    this.produto = this.route.snapshot.data['produto'];
  }
  
}
