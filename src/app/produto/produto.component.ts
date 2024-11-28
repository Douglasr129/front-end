import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router'

@Component({
  selector: 'app-produto',
  standalone:true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class ProdutoComponent {

}
