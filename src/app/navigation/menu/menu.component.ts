import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, CommonModule, NgbCollapse],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
isCollapsed: boolean;
/**
 *
 */
constructor() {
  this.isCollapsed = true;
  
}

}
